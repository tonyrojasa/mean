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
 * Store Schema
 */
var StoreSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
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

StoreSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
StoreSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
StoreSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

StoreSchema.statics.seed = seed;

mongoose.model('Store', StoreSchema);

/**
* Seeds the User collection with document (Store)
* and provided options.
*/
function seed(doc, options) {
  var Store = mongoose.model('Store');

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
        Store
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

            // Remove Store (overwrite)

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
            message: chalk.yellow('Database Seeding: Store\t' + doc.title + ' skipped')
          });
        }

        var store = new Store(doc);

        store.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Store\t' + store.title + ' added'
          });
        });
      });
    }
  });
}
