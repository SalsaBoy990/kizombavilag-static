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
  const md = require('markdown-it')({
    html: true })
  const implicitFigures = require('markdown-it-implicit-figures')
  const markdownItTable = require('markdown-it-multimd-table')
  const markdownItSup = require('markdown-it-sup')
  const markdownItSub = require('markdown-it-sub')
  const markdownItAttrs = require('markdown-it-attrs')
  const markdownItHighlightjs = require('markdown-it-highlightjs')

  md.use(implicitFigures, {
    dataType: false, // <figure data-type="image">, default: false
    figcaption: true, // <figcaption>alternative text</figcaption>, default: false
    tabindex: false, // <figure tabindex="1+n">..., default: false
    link: false // <a href="img.png"><img src="img.png"></a>, default: false
  })

  md.use(markdownItTable)
  md.use(markdownItSup)
  md.use(markdownItSub)
  md.use(markdownItAttrs)
  md.use(markdownItHighlightjs)

  // Store the paths to the blogposts for the links in the index page
  const postsDataForIndexPage = []

  // clear destination folder first, it needs to be synchronous
  fse.emptyDirSync(distPath)

  // copy assets folder (contains images, scripts and css) and favicon folder to destination
  ssg.copyAssetsFaviconFolders(srcPath, distPath)

  // copy _headers file to the root of /public folder
  ssg.copyHeadersFile(srcPath, distPath)

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

      // generate postid for the post (needed for disqus)
      const postId = ssg.generatePostId(fileData)

      // make output directories for the posts
      const destPath = path.join(distPath, fileData.dir)
      fse.mkdirsSync(destPath)

      // file path
      const pathToFile = `${srcPath}/posts/${file}`

      // read data from file and then render post
      const postData = ssg.getPostDataFromMarkdown(pathToFile)

      // change date format
      const dateFormatted = ssg.convertDateFormat(postData, pathToFile, [
        'január', 'február', 'március',
        'április', 'május', 'június',
        'július', 'augusztus', 'szeptember',
        'október', 'november', 'december'
      ])

      // convert md to HTML
      const postContents = md.render(postData.body)

      const templateConfig = Object.assign({}, config, {
        title: postData.attributes.title,
        date: dateFormatted,
        excerpt: postData.attributes.excerpt,
        comments: postData.attributes.comments ? postData.attributes.comments : false,
        topic: (postData.attributes.topic) ? postData.attributes.topic : false,
        body: postContents,
        canonicalUrl: canonicalUrl,
        postId: postId,
        postTitleMeta: config.site.title + ': ' + postData.attributes.title
      })

      // save postdata for the index page
      ssg.savePostDataForIndexPage(fileData, dateFormatted, postData, postsDataForIndexPage)

      // read layout data from file and then render layout with post contents
      const layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/single-article.ejs`, 'utf-8'),
        templateConfig, { filename: `${srcPath}/layouts/single-article.ejs` })

      // save the rendered blogposts to destination folder
      ssg.saveBlogpostsHTML(fileData, destPath, layoutContent)
    })
    console.log('Posts OK...')
  } catch (err) {
    console.error(err)
    console.error('Build posts failed...')
  }

  let blogArchive = []

  // get the postsData for the archive on the index page grouped by year
  ssg.getDataForArchive(postsDataForIndexPage, config, blogArchive)

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
        postsDataForIndexPage: postsDataForIndexPage,
        blogArchive: blogArchive
      }))

      const name = fileData.base
      let layoutContent

      // read layout data from file and then render layout with page contents
      switch (name) {
        case 'index.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/home.ejs`, 'utf-8'), Object.assign({}, config, {
            title: 'Eseményajánló / ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url,
            description: config.site.quote
          }), { filename: `${srcPath}/layouts/home.ejs` })
          break
        case 'zenek.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/music.ejs`, 'utf-8'), Object.assign({}, config, {
            title: 'Zeneajánlók / ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/zenek',
            description: config.site.description
          }), { filename: `${srcPath}/layouts/music.ejs` })
          break
        case 'tancos-videok.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/dancers.ejs`, 'utf-8'), Object.assign({}, config, {
            title: 'Táncos videók / ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/tancos-videok',
            description: config.site.description
          }), { filename: `${srcPath}/layouts/dancers.ejs` })
          break
        case 'oktato-videok.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/education.ejs`, 'utf-8'), Object.assign({}, config, {
            title: 'Oktató videók / ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/oktato-videok',
            description: config.site.description
          }), { filename: `${srcPath}/layouts/education.ejs` })
          break
        case 'cikkek.ejs':
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/articles.ejs`, 'utf-8'), Object.assign({}, config, postsDataForIndexPage, {
            title: 'Cikkek / ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/cikkek',
            description: config.site.description
          }), { filename: `${srcPath}/layouts/articles.ejs` })
          break
        default:
          layoutContent = ejsRender(fse.readFileSync(`${srcPath}/layouts/home.ejs`, 'utf-8'), Object.assign({}, config, {
            title: '404: Nem található / ' + config.site.title,
            body: pageContents,
            canonicalUrl: config.site.url + '/' + fileData.name,
            description: config.site.description
          }), { filename: `${srcPath}/layouts/home.ejs` })
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
