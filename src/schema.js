/**
 * Created by Chen Jyun Yan on 2016/7/4.
 */

export const htmlObjectSchema = {
  id: '/htmlObjectSchema',
  type: 'object',
  properties: {
    name: {type: 'string'},
    updated_on: {type: 'string'},
    value: {type: 'string'},
    max_value: {type: 'string'},
    min_value: {type: 'string'}
  },
  required: ['name', 'updated_on', 'value', 'max_value', 'min_value']
};

export const formatObjectSchema = {
  id: '/htmlObjectSchema',
  type: 'object',
  properties: {
    name: {type: 'string'},
    updated_on: {type: 'integer'},
    value: {type: 'number'},
    max_value: {type: 'number'},
    min_value: {type: 'number'}
  },
  required: ['name', 'updated_on', 'value', 'max_value', 'min_value']
};