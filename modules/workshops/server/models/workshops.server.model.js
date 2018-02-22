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
 * Workshop Schema
 */
var WorkshopSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    trim: true,
    required: 'Name cannot be blank'
  },
  location: {
    type: String,
    trim: true,
    required: 'Please provide at least one location'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

WorkshopSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
WorkshopSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
WorkshopSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

WorkshopSchema.statics.seed = seed;

mongoose.model('Workshop', WorkshopSchema);

/**
* Seeds the User collection with document (Workshop)
* and provided options.
*/
function seed(doc, options) {
  var Workshop = mongoose.model('Workshop');

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
        Workshop
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

            // Remove Workshop (overwrite)

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
            message: chalk.yellow('Database Seeding: Workshop\t' + doc.title + ' skipped')
          });
        }

        var workshop = new Workshop(doc);

        workshop.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Workshop\t' + workshop.title + ' added'
          });
        });
      });
    }
  });
}
