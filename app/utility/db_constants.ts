// import roleModel from "../modules/role/role.schema";
// import { ObjectId } from "mongodb";

// export const populate = async () => {
//   try {
//     const allRoles = () => {
//       return roleModel.find({}, { name: 1, _id: { $toString: "$_id" } }).exec();
//     };
//     const assignVariable = async () => {
//       try {
//         const allRolesArr = await allRoles();

//         return [allRolesArr];
//       } catch (error) {
//         throw error;
//       }
//     };
//     const variables = await assignVariable();
//     // console.log(variables);
//   } catch (error) {
//     throw error;
//   }
// };

// console.log(populatedVariableArray)
//get return value of populate function i.e. Array in populatedVariableArray.

// let populatedVariableArray: any = [];

// const convertArrayToObject = (array: any, key: any) => {
//   const initialValue = {};
//   return array.reduce((obj: any, item: any) => {
//     return {
//       ...obj,
//       [item[key]]: item._id.toHexString(),
//     };
//   }, initialValue);
// };

// const allRollsObject = convertArrayToObject(populatedVariableArray[0], "name");
let allRollsObject = {
  Admin: "625e36afbe9bb54da8934ee1",
  User: "625e36c0be9bb54da8934ee2",
};
export const ROLES = allRollsObject;
