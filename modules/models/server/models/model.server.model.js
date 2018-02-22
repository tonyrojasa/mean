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
 * Model Schema
 */
var ModelSchema = new Schema({
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
  brand: {
    type: Schema.ObjectId,
    ref: 'Brand',
    required: 'brand cannot be blank'
  },
  modelType: {
    type: Schema.ObjectId,
    ref: 'ModelType',
    required: 'modelType cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ModelSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
ModelSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
ModelSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

ModelSchema.statics.seed = seed;

mongoose.model('Model', ModelSchema);

/**
* Seeds the User collection with document (Model)
* and provided options.
*/
function seed(doc, options) {
  var Model = mongoose.model('Model');

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
        Model
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

            // Remove Model (overwrite)

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
            message: chalk.yellow('Database Seeding: Model\t' + doc.title + ' skipped')
          });
        }

        var model = new Model(doc);

        model.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Model\t' + model.title + ' added'
          });
        });
      });
    }
  });
}
