;(function () {
  'use strict'
  // file system module with extended functionality
  const fse = require('fs-extra')
  const path = require('path')
  // use promises to avoid callback hell and simplify code
  const { promisify } = require('util')
  // renders ejs layouts to html
  const ejsRenderFile = promisify(require('ejs').renderFile)

  // search for matching files, returns array of filenames
  const globP = promisify(require('glob'))

  // site configuration properties and blogpost metadata imported from MySQL database in JSON format
  const config = require('../site.config')

  const pathsToPosts = require('../src/data/postUrls.json')

  // source directory
  const srcPath = './src'
  // destination folder to where the static site will be generated
  const distPath = './public'

  // Build subpages (in our example the index, about, book pages)
  // cwd: current working directory
  globP('**/*.ejs', { cwd: `${srcPath}/pages` })
    .then((files) => {
      files.forEach((file) => {
        const fileData = path.parse(file)

        const destPath = path.join(distPath, fileData.dir)

        fse.mkdirs(destPath)
          .then(() => {
            // render page
            return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, config, { pathsToPosts: pathsToPosts , title: '404: A keresett oldal nem található!' }))
          })
          .then((pageContents) => {
            let name = fileData.base
            // render layout with page contents
            switch (name) {
              case 'index.ejs':
                return ejsRenderFile(`${srcPath}/layouts/home.ejs`, Object.assign({}, config, {
                  title: config.site.title,
                  body: pageContents,
                  canonicalUrl: config.site.url,
                  description: config.site.description
                }))
              case 'esemenyek.ejs':
                return ejsRenderFile(`${srcPath}/layouts/events.ejs`, Object.assign({}, config, {
                  title: 'Eseményajánló / ' + config.site.title,
                  body: pageContents,
                  canonicalUrl: config.site.url + '/esemenyek',
                  description: ''
                }))
              case 'zenek.ejs':
                return ejsRenderFile(`${srcPath}/layouts/music.ejs`, Object.assign({}, config, {
                  title: 'Zeneajánlók / ' + config.site.title,
                  body: pageContents,
                  canonicalUrl: config.site.url + '/zenek',
                  description: ''
                }))
              case 'tancos-videok.ejs':
                return ejsRenderFile(`${srcPath}/layouts/dancers.ejs`, Object.assign({}, config, {
                  title: 'Táncos videók / ' + config.site.title,
                  body: pageContents,
                  canonicalUrl: config.site.url + '/tancos-videok',
                  description: ''
                }))
              case 'oktato-videok.ejs':
                return ejsRenderFile(`${srcPath}/layouts/education.ejs`, Object.assign({}, config, {
                  title: 'Oktató videók / ' + config.site.title,
                  body: pageContents,
                  canonicalUrl: config.site.url + '/oktato-videok',
                  description: ''
                }))
              case 'cikkek.ejs':
                return ejsRenderFile(`${srcPath}/layouts/articles.ejs`, Object.assign({}, config, {
                  title: 'Cikkek / ' + config.site.title,
                  body: pageContents,
                  canonicalUrl: config.site.url + '/cikkek',
                  pathsToPosts: pathsToPosts
                }))
              default:
                return ejsRenderFile(`${srcPath}/layouts/home.ejs`, Object.assign({}, config, {
                  title: '404: A keresett oldal nem található',
                  body: pageContents,
                  canonicalUrl: config.site.url + '/' + fileData.name,
                  description: 'Biztos, hogy helyes ez a cím? Mert itt nem található semmilyen cikk.'
                }))
            }
          })
          .then((layoutContent) => {
            // save the html file
            fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
          })
          .catch(err => { console.error(err) })
      })
    })
    .then(() => {
      console.log('Successful build! Subpages OK.')
    })
    .catch(err => { console.error(err) })
})()
