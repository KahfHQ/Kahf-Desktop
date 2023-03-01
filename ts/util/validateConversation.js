var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var validateConversation_exports = {};
__export(validateConversation_exports, {
  validateConversation: () => validateConversation
});
module.exports = __toCommonJS(validateConversation_exports);
var import_whatTypeOfConversation = require("./whatTypeOfConversation");
var import_libphonenumberUtil = require("./libphonenumberUtil");
var import_UUID = require("../types/UUID");
function validateConversation(attributes) {
  if (attributes.type !== "private" && attributes.type !== "group") {
    return `Invalid conversation type: ${attributes.type}`;
  }
  if (!attributes.e164 && !attributes.uuid && !attributes.groupId) {
    return "Missing one of e164, uuid, or groupId";
  }
  const error = validateNumber(attributes) || validateUuid(attributes);
  if (error) {
    return error;
  }
  return null;
}
function validateNumber(attributes) {
  if ((0, import_whatTypeOfConversation.isDirectConversation)(attributes) && attributes.e164) {
    const regionCode = window.storage.get("regionCode");
    if (!regionCode) {
      throw new Error("No region code");
    }
    const number = (0, import_libphonenumberUtil.parseNumber)(attributes.e164, regionCode);
    if (number.isValidNumber) {
      return null;
    }
    let errorMessage;
    if (number.error instanceof Error) {
      errorMessage = number.error.message;
    } else if (typeof number.error === "string") {
      errorMessage = number.error;
    }
    return errorMessage || "Invalid phone number";
  }
  return null;
}
function validateUuid(attributes) {
  if ((0, import_whatTypeOfConversation.isDirectConversation)(attributes) && attributes.uuid) {
    if ((0, import_UUID.isValidUuid)(attributes.uuid)) {
      return null;
    }
    return "Invalid UUID";
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateConversation
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidmFsaWRhdGVDb252ZXJzYXRpb24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBWYWxpZGF0ZUNvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB7IGlzRGlyZWN0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi93aGF0VHlwZU9mQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSAnLi9saWJwaG9uZW51bWJlclV0aWwnO1xuaW1wb3J0IHsgaXNWYWxpZFV1aWQgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udmVyc2F0aW9uKFxuICBhdHRyaWJ1dGVzOiBWYWxpZGF0ZUNvbnZlcnNhdGlvblR5cGVcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoYXR0cmlidXRlcy50eXBlICE9PSAncHJpdmF0ZScgJiYgYXR0cmlidXRlcy50eXBlICE9PSAnZ3JvdXAnKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkIGNvbnZlcnNhdGlvbiB0eXBlOiAke2F0dHJpYnV0ZXMudHlwZX1gO1xuICB9XG5cbiAgaWYgKCFhdHRyaWJ1dGVzLmUxNjQgJiYgIWF0dHJpYnV0ZXMudXVpZCAmJiAhYXR0cmlidXRlcy5ncm91cElkKSB7XG4gICAgcmV0dXJuICdNaXNzaW5nIG9uZSBvZiBlMTY0LCB1dWlkLCBvciBncm91cElkJztcbiAgfVxuXG4gIGNvbnN0IGVycm9yID0gdmFsaWRhdGVOdW1iZXIoYXR0cmlidXRlcykgfHwgdmFsaWRhdGVVdWlkKGF0dHJpYnV0ZXMpO1xuXG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiBlcnJvcjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU51bWJlcihhdHRyaWJ1dGVzOiBWYWxpZGF0ZUNvbnZlcnNhdGlvblR5cGUpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKGF0dHJpYnV0ZXMpICYmIGF0dHJpYnV0ZXMuZTE2NCkge1xuICAgIGNvbnN0IHJlZ2lvbkNvZGUgPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ3JlZ2lvbkNvZGUnKTtcbiAgICBpZiAoIXJlZ2lvbkNvZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmVnaW9uIGNvZGUnKTtcbiAgICB9XG4gICAgY29uc3QgbnVtYmVyID0gcGFyc2VOdW1iZXIoYXR0cmlidXRlcy5lMTY0LCByZWdpb25Db2RlKTtcbiAgICBpZiAobnVtYmVyLmlzVmFsaWROdW1iZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBlcnJvck1lc3NhZ2U6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgICBpZiAobnVtYmVyLmVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IG51bWJlci5lcnJvci5tZXNzYWdlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG51bWJlci5lcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IG51bWJlci5lcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9yTWVzc2FnZSB8fCAnSW52YWxpZCBwaG9uZSBudW1iZXInO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVXVpZChhdHRyaWJ1dGVzOiBWYWxpZGF0ZUNvbnZlcnNhdGlvblR5cGUpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKGF0dHJpYnV0ZXMpICYmIGF0dHJpYnV0ZXMudXVpZCkge1xuICAgIGlmIChpc1ZhbGlkVXVpZChhdHRyaWJ1dGVzLnV1aWQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gJ0ludmFsaWQgVVVJRCc7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxvQ0FBcUM7QUFDckMsZ0NBQTRCO0FBQzVCLGtCQUE0QjtBQUVyQiw4QkFDTCxZQUNlO0FBQ2YsTUFBSSxXQUFXLFNBQVMsYUFBYSxXQUFXLFNBQVMsU0FBUztBQUNoRSxXQUFPLDhCQUE4QixXQUFXO0FBQUEsRUFDbEQ7QUFFQSxNQUFJLENBQUMsV0FBVyxRQUFRLENBQUMsV0FBVyxRQUFRLENBQUMsV0FBVyxTQUFTO0FBQy9ELFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxRQUFRLGVBQWUsVUFBVSxLQUFLLGFBQWEsVUFBVTtBQUVuRSxNQUFJLE9BQU87QUFDVCxXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU87QUFDVDtBQWxCZ0IsQUFvQmhCLHdCQUF3QixZQUFxRDtBQUMzRSxNQUFJLHdEQUFxQixVQUFVLEtBQUssV0FBVyxNQUFNO0FBQ3ZELFVBQU0sYUFBYSxPQUFPLFFBQVEsSUFBSSxZQUFZO0FBQ2xELFFBQUksQ0FBQyxZQUFZO0FBQ2YsWUFBTSxJQUFJLE1BQU0sZ0JBQWdCO0FBQUEsSUFDbEM7QUFDQSxVQUFNLFNBQVMsMkNBQVksV0FBVyxNQUFNLFVBQVU7QUFDdEQsUUFBSSxPQUFPLGVBQWU7QUFDeEIsYUFBTztBQUFBLElBQ1Q7QUFFQSxRQUFJO0FBQ0osUUFBSSxPQUFPLGlCQUFpQixPQUFPO0FBQ2pDLHFCQUFlLE9BQU8sTUFBTTtBQUFBLElBQzlCLFdBQVcsT0FBTyxPQUFPLFVBQVUsVUFBVTtBQUMzQyxxQkFBZSxPQUFPO0FBQUEsSUFDeEI7QUFDQSxXQUFPLGdCQUFnQjtBQUFBLEVBQ3pCO0FBRUEsU0FBTztBQUNUO0FBckJTLEFBdUJULHNCQUFzQixZQUFxRDtBQUN6RSxNQUFJLHdEQUFxQixVQUFVLEtBQUssV0FBVyxNQUFNO0FBQ3ZELFFBQUksNkJBQVksV0FBVyxJQUFJLEdBQUc7QUFDaEMsYUFBTztBQUFBLElBQ1Q7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU87QUFDVDtBQVZTIiwKICAibmFtZXMiOiBbXQp9Cg==
