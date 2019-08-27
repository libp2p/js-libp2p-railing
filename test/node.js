/* eslint-env mocha */
'use strict'
/// <reference path="../../src/types.d.ts" />

const tt = require('typescript-definition-tester')
// typings test should run only in the node
// environment due to reading of files
describe('typings declaration tests', () => {
  it('should compile typings examples successfully against types.d.ts', (done) => {
    tt.compileDirectory(
      `${__dirname}/typings`,
      (fileName) => fileName.indexOf('.pass.ts') > -1,
      (error) => done(error)
    )
  })

  it('should fail to compile typings examples successfully against types.d.ts', (done) => {
    tt.compileDirectory(
      `${__dirname}/typings`,
      (fileName) => fileName.indexOf('.fail.ts') > -1,
      (error) => {
        if (error) {
          return done(null)
        }
        done(new Error('Should throw compilation error as Bootstrap is default export'))
      }
    )
  })
})
