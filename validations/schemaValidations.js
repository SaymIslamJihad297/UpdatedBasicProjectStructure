const Joi = require('joi');

module.exports.userSchemaValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().optional(),
})

module.exports.LoginFormValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports.subscriptionSchemaValidator = Joi.object({
    user: Joi.string().required(),
    planType: Joi.string().valid('free', 'premium').required(),
    isActive: Joi.boolean().default(false),
    mockTestLimit: Joi.number().min(0).default(1),
    aiScoringLimit: Joi.number().min(0).default(5),
    sectionalMockTestLimit: Joi.number().min(0).default(1),
    cyoMockTestLimit: Joi.number().min(0).default(1),
    templates: Joi.number().min(0).default(5),
    studyPlan: Joi.string().valid('authorized', 'unauthorized').required(),
    performanceProgressDetailed: Joi.string().valid('authorized', 'unauthorized').required(),
    startedAt: Joi.date().default(() => new Date()),
    expiresAt: Joi.date().required(),
    paymentInfo: Joi.object({
      transactionId: Joi.string().required(),
      provider: Joi.string().required(),
      amount: Joi.number().required(),
      currency: Joi.string().required()
    }).required()
});


module.exports.FillInTheBlanksQuestionSchemaValidator = Joi.object({
    type: Joi.string().required(),
    subtype: Joi.string().required(),
    prompt: Joi.string().required(),
    blanks: Joi.array().required(),
})


module.exports.mcqMultipleSchemaValidator = Joi.object({
    type: Joi.string().required(),
    subtype: Joi.string().required(),
    prompt: Joi.string().required(),
    options: Joi.array().required(),
    correctAnswers: Joi.array().required(),
})
module.exports.mcqSingleSchemaValidator = Joi.object({
    type: Joi.string().required(),
    subtype: Joi.string().required(),
    prompt: Joi.string().required(),
    options: Joi.array().required(),
    correctAnswers: Joi.array().required(),
})