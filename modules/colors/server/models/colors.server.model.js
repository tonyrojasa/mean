'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');
var mongoose_delete = require('mongoose-delete');
/**
 * Color Schema
 */
var ColorSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'name cannot be blank'
  },
  code: {
    type: String,
    trim: true,
    required: 'name cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ColorSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
ColorSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
ColorSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

ColorSchema.statics.seed = seed;

mongoose.model('Color', ColorSchema);

/**
* Seeds the User collection with document (Color)
* and provided options.
*/
function seed(doc, options) {
  var Color = mongoose.model('Color');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Color
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Color (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Color\t' + doc.title + ' skipped')
          });
        }

        var color = new Color(doc);

        color.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Color\t' + color.title + ' added'
          });
        });
      });
    }
  });
}
