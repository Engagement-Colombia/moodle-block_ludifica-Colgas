// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/* jshint node: true, browser: false */
/* eslint-env node */

/**
 * Grunt configuration for ludifica block.
 *
 * @module    block/ludifica
 * @copyright 2023 David Herney @ BambuCo
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

"use strict";

/**
 * Grunt configuration.
 *
 * @param {Grunt} grunt
 */
module.exports = function(grunt) {

    var path = require('path'),
        PWD = process.env.PWD || process.cwd();

    // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
    require("grunt-load-gruntfile")(grunt);
    grunt.loadGruntfile("../../Gruntfile.js");

    // Load all grunt tasks.
    grunt.loadNpmTasks("grunt-stylelint");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    /**
     * Function to generate the destination for the uglify task
     * (e.g. build/file.min.js). This function will be passed to
     * the rename property of files array when building dynamically:
     * http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
     *
     * @param {String} destPath the current destination
     * @param {String} srcPath the  matched src path
     * @return {String} The rewritten destination path.
     */
    var uglifyRename = function(destPath, srcPath) {
        destPath = srcPath.replace("src", "build");
        destPath = destPath.replace(".js", ".min.js");
        destPath = path.resolve(PWD, destPath);
        return destPath;
    };

    grunt.initConfig({
        eslint: {
            amd: {src: "**/amd/src/*.js"}
        },
        uglify: {
            amd: {
                files: [{
                    expand: true,
                    src: "**/amd/src/*.js",
                    rename: uglifyRename
                }],
                options: {
                    report: "min",
                    sourceMap: true
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            amd: {
                files: ["amd/src/**/*.js"],
                tasks: ["amd"]
            },
            css: {
                files: ["templates/*/styles.css", "styles.css"],
                tasks: ["stylelint:css"]
            }
        },
        stylelint: {
            css: {
                src: ["templates/*/styles.css"]
            }
        },
    });

    // Register tasks.
    grunt.registerTask("css", ["stylelint:css"]);
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask('amd', ['eslint:amd', 'uglify:amd']);

};
