(function () {
  'use strict'
  // store start time
  const startTime = process.hrtime()

  // logger funtion on command line with styling
  const log = require('./utils/logger')

  log.info('Building site...')

  // load utility functions
  const ssg = require('./utils/utils')

  // file system module with extended functionality
  const fse = require('fs-extra')
  const path = require('path')

  // search for matching files, returns array of filenames
  const glob = require('glob')

  // site configuration properties
  const config = require('../site.config')

  // source directory
  const srcPath = './src'
  // destination folder to where the static site will be generated
  const distPath = './public'

  // renders ejs layouts to html
  const ejsRender = require('ejs').render

  // render markdown to HTML
  const md = require('markdown-it')()
  const implicitFigures = require('markdown-it-implicit-figures')
  const markdownItTable = require('markdown-it-multimd-table')
  const markdownItSup = require('markdown-it-sup')
  const markdownItSub = require('markdown-it-sub')
  const markdownItAttrs = require('markdown-it-attrs')
  const markdownItHighlightjs = require('markdown-it-highlightjs')
  const markdownItVideo = require('markdown-it-video')

  md.use(markdownItTable)
  md.use(markdownItSup)
  md.use(markdownItSub)
  md.use(markdownItAttrs)
  md.use(implicitFigures, {
    dataType: false, // <figure data-type="image">, default: false
    figcaption: true, // <figcaption>alternative text</figcaption>, default: false
    tabindex: false, // <figure tabindex="1+n">..., default: false
    link: false // <a href="img.png"><img src="img.png"></a>, default: false
  })
  md.use(markdownItHighlightjs)
  md.use(markdownItVideo, {
    youtube: { width: 560, height: 315 }
  })

  // Store the paths to the blogposts for the links in the index page
  const postsDataForIndexPage = []

  // clear destination folder first, it needs to be synchronous
  fse.emptyDirSync(distPath)

  // copy assets folder (contains images, scripts and css) and favicon folder to destination
  ssg.copyAssetsFaviconFolders(srcPath, distPath)

  // copy _headers file to the root of /public folder
  ssg.copyRootFile('_headers', srcPath, distPath)

  // copy _redirects file to the root of /public folder
  ssg.copyRootFile('_redirects', srcPath, distPath)

  // copy sitemap.xml file to the root of /public folder
  ssg.copyRootFile('sitemap.xml', srcPath, distPath)

  // copy google516a68c0c3ff5302.html file to the root of /public folder
  ssg.copyRootFile('google516a68c0c3ff5302.html', srcPath, distPath)

  // copy admin folder to the root of /public folder
  ssg.copyAdminFolder(srcPath, distPath)

  // Build the blogposts
  // cwd: current working directory
  const files = glob.sync('**/*.@(ejs|md)', {
    cwd: `${srcPath}/posts`
  })

  try {
    files.forEach((file) => {
      const fileData = path.parse(file)

      // generate canonical url for the post
      const canonicalUrl = ssg.generateCanonicalURL(fileData, config)

      // make output directories for the posts
      const destPath = path.join(distPath, fileData.dir)
      fse.mkdirsSync(destPath)

      // file path
      const pathToFile = `${srcPath}/posts/${file}`

      // read data from file and then render post
      const postData = ssg.getPostDataFromMarkdown(pathToFile)

      // change date format
      const dateFormatted = ssg.convertDateFormat(postData, pathToFile, [
        'jan.', 'feb.', 'márc.',
        'ápr.', 'máj.', 'jún.',
        'júl.', 'aug.', 'szept.',
        'okt.', 'nov.', 'dec.'
      ])

      // convert md to HTML
      const postContents = md.render(postData.body)

      const templateConfig = Object.assign({}, config, {
        title: postData.attributes.title,
        author: postData.attributes.author,
        date: dateFormatted,
        excerpt: postData.attributes.excerpt,
        /* 3 topics: zene | tánc | kultúra */
        topic: postData.attributes.topic,
        body: postContents,
        canonicalUrl: canonicalUrl,
        coverImage: postData.attributes.coverImage,
        postTitleMeta: postData.attributes.title + ' | ' + config.site.title
      })

      // save postdata for the index page
      ssg.savePostDataForIndexPage(fileData, dateFormatted, postData, postsDataForIndexPage)

      // read layout data from file and then render layout with post contents
      const layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/blogpost.ejs`, 'utf-8'),
        templateConfig, { filename: `${srcPath}/layouts/blogpost.ejs` })

      // save the rendered blogposts to destination folder
      ssg.saveBlogpostsHTML(fileData, destPath, layoutContent)
    })
    console.log('Posts OK...')
  } catch (err) {
    console.error(err)
    console.error('Build posts failed...')
  }

  // Build subpages (in our example the index, about, book pages)
  // cwd: current working directory
  const pages = glob.sync('**/*.ejs', {
    cwd: `${srcPath}/pages`
  })

  try {
    pages.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      // make directory
      fse.mkdirsSync(destPath)

      // read data from file and then render page
      const pageContents = ejsRender(fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8'), Object.assign({}, config, {
        postsDataForIndexPage: postsDataForIndexPage
      }))

      const name = fileData.base
      let layoutContent

      // read layout data from file and then render layout with page contents
      switch (name) {
        case 'index.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/home.ejs`, 'utf-8'), Object.assign({}, config, postsDataForIndexPage, {
            title: config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url,
            description: config.site.quote
          }), { filename: `${srcPath}/layouts/home.ejs` })
          break

        case 'uzenet-elkuldve.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/default.ejs`, 'utf-8'), Object.assign({}, config, {
            title: 'Köszönjük az érdeklődést! | ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/' + fileData.name,
            description: config.site.quote
          }), { filename: `${srcPath}/layouts/default.ejs` })
          break

        default:
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/default.ejs`, 'utf-8'), Object.assign({}, config, {
            title: '404: A keresett oldal nem található | ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/' + fileData.name,
            description: config.site.quote
          }), { filename: `${srcPath}/layouts/default.ejs` })
          break
      }
      // save the html file
      fse.writeFileSync(`${destPath}/${fileData.name}.html`, layoutContent)
    })
    console.log('Pages OK...')
  } catch (err) {
    console.error(err)
    console.error('Build pages failed...')
  }

  // display build time
  const timeDiff = process.hrtime(startTime)
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6
  log.success(`Site built successfully in ${duration}ms`)
})()
