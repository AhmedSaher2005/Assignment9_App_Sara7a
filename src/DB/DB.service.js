export const create = async ({ model, data, option = {} } = {}) => {
  return await model.create([data], option);
};
export const findOne = async ({ model, filter, option = {} } = {}) => {
  return await model.findOne(filter, option);
};
export const findById = async ({ model, id, option = {} } = {}) => {
  return await model.findById(id, option);
};
export const findByIdAndUpdate = async ({ model, id, update, option = {} } = {}) => {
  return await model.findByIdAndUpdate(id, update,{new:true,runvalidator:true, ...option});
};
export const findOneAndUpdate = async ({ model, filter,update, option = {} } = {}) => {
  return await model.findOneAndUpdate(filter, update,option);
};
