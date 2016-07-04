/**
 * Created by Chen Jyun Yan on 2016/7/4.
 */

export const htmlObjectSchema = {
  id: '/htmlObjectSchema',
  type: 'object',
  properties: {
    name: {type: 'string'},
    updatedOn: {type: 'string'},
    value: {type: 'string'},
    maxValue: {type: 'string'},
    minValue: {type: 'string'}
  },
  required: ['name', 'updatedOn', 'value', 'maxValue', 'minValue']
};

export const formatObjectSchema = {
  id: '/htmlObjectSchema',
  type: 'object',
  properties: {
    name: {type: 'string'},
    updatedOn: {type: 'integer'},
    value: {type: 'number'},
    maxValue: {type: 'number'},
    minValue: {type: 'number'}
  },
  required: ['name', 'updatedOn', 'value', 'maxValue', 'minValue']
};