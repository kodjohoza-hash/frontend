const planCreateSchema = require('./plan.validator').planCreateSchema;
const planUpdateSchema = require('./plan.validator').planUpdateSchema;
const subscriptionCreateSchema = require('./subscription.validator').subscriptionCreateSchema;
const subscriptionRenewSchema = require('./subscription.validator').subscriptionRenewSchema;
const subscriptionSuspendSchema = require('./subscription.validator').subscriptionSuspendSchema;
const subscriptionFilterSchema = require('./subscription.validator').subscriptionFilterSchema;
const idParamSchema = require('./common.validator').idParamSchema;

module.exports = {
  planCreateSchema,
  planUpdateSchema,
  subscriptionCreateSchema,
  subscriptionRenewSchema,
  subscriptionSuspendSchema,
  subscriptionFilterSchema,
  idParamSchema,
};
