var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_chai = require("chai");
var import_Client = __toESM(require("../../sql/Client"));
var import_UUID = require("../../types/UUID");
const {
  _deleteAllStoryDistributions,
  _getAllStoryDistributionMembers,
  _getAllStoryDistributions,
  createNewStoryDistribution,
  deleteStoryDistribution,
  getAllStoryDistributionsWithMembers,
  modifyStoryDistribution,
  modifyStoryDistributionMembers,
  modifyStoryDistributionWithMembers
} = import_Client.default;
function getUuid() {
  return import_UUID.UUID.generate().toString();
}
describe("sql/storyDistribution", () => {
  beforeEach(async () => {
    await _deleteAllStoryDistributions();
  });
  it("roundtrips with create/fetch/delete", async () => {
    const list = {
      id: getUuid(),
      name: "My Story",
      allowsReplies: true,
      isBlockList: false,
      members: [getUuid(), getUuid()],
      senderKeyInfo: {
        createdAtDate: Date.now(),
        distributionId: getUuid(),
        memberDevices: []
      },
      storageID: getUuid(),
      storageVersion: 1,
      storageNeedsSync: false,
      storageUnknownFields: void 0,
      deletedAtTimestamp: void 0
    };
    await createNewStoryDistribution(list);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 2);
    const allHydratedLists = await getAllStoryDistributionsWithMembers();
    import_chai.assert.lengthOf(allHydratedLists, 1);
    import_chai.assert.deepEqual(allHydratedLists[0], list);
    await deleteStoryDistribution(list.id);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 0);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 0);
    import_chai.assert.lengthOf(await getAllStoryDistributionsWithMembers(), 0);
  });
  it("updates core fields with modifyStoryDistribution", async () => {
    const UUID_1 = getUuid();
    const UUID_2 = getUuid();
    const list = {
      id: getUuid(),
      name: "My Story",
      allowsReplies: true,
      isBlockList: false,
      members: [UUID_1, UUID_2],
      senderKeyInfo: {
        createdAtDate: Date.now(),
        distributionId: getUuid(),
        memberDevices: []
      },
      storageID: getUuid(),
      storageVersion: 1,
      storageNeedsSync: false,
      storageUnknownFields: void 0,
      deletedAtTimestamp: void 0
    };
    await createNewStoryDistribution(list);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 2);
    const updated = {
      ...list,
      name: "Updated story",
      senderKeyInfo: {
        createdAtDate: Date.now() + 10,
        distributionId: getUuid(),
        memberDevices: [
          {
            id: 1,
            identifier: UUID_1,
            registrationId: 232
          }
        ]
      }
    };
    await modifyStoryDistribution(updated);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 2);
    const allHydratedLists = await getAllStoryDistributionsWithMembers();
    import_chai.assert.lengthOf(allHydratedLists, 1);
    import_chai.assert.deepEqual(allHydratedLists[0], updated);
  });
  it("adds and removes with modifyStoryDistributionMembers", async () => {
    const UUID_1 = getUuid();
    const UUID_2 = getUuid();
    const UUID_3 = getUuid();
    const UUID_4 = getUuid();
    const list = {
      id: getUuid(),
      name: "My Story",
      allowsReplies: true,
      isBlockList: false,
      members: [UUID_1, UUID_2],
      senderKeyInfo: {
        createdAtDate: Date.now(),
        distributionId: getUuid(),
        memberDevices: []
      },
      storageID: getUuid(),
      storageVersion: 1,
      storageNeedsSync: false,
      storageUnknownFields: void 0,
      deletedAtTimestamp: void 0
    };
    await createNewStoryDistribution(list);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 2);
    await modifyStoryDistributionMembers(list.id, {
      toAdd: [UUID_3, UUID_4],
      toRemove: [UUID_1]
    });
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 3);
    const allHydratedLists = await getAllStoryDistributionsWithMembers();
    import_chai.assert.lengthOf(allHydratedLists, 1);
    import_chai.assert.deepEqual(allHydratedLists[0], {
      ...list,
      members: [UUID_2, UUID_3, UUID_4]
    });
  });
  it("adds and removes with modifyStoryDistributionWithMembers", async () => {
    const UUID_1 = getUuid();
    const UUID_2 = getUuid();
    const UUID_3 = getUuid();
    const UUID_4 = getUuid();
    const list = {
      id: getUuid(),
      name: "My Story",
      allowsReplies: true,
      isBlockList: false,
      members: [UUID_1, UUID_2],
      senderKeyInfo: {
        createdAtDate: Date.now(),
        distributionId: getUuid(),
        memberDevices: []
      },
      storageID: getUuid(),
      storageVersion: 1,
      storageNeedsSync: false,
      storageUnknownFields: void 0,
      deletedAtTimestamp: void 0
    };
    await createNewStoryDistribution(list);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 2);
    await modifyStoryDistributionWithMembers(list, {
      toAdd: [UUID_3, UUID_4],
      toRemove: [UUID_1]
    });
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 3);
    const allHydratedLists = await getAllStoryDistributionsWithMembers();
    import_chai.assert.lengthOf(allHydratedLists, 1);
    import_chai.assert.deepEqual(allHydratedLists[0], {
      ...list,
      members: [UUID_2, UUID_3, UUID_4]
    });
  });
  it("eliminates duplicates without complaint in createNewStoryDistribution", async () => {
    const UUID_1 = getUuid();
    const UUID_2 = getUuid();
    const list = {
      id: getUuid(),
      name: "My Story",
      allowsReplies: true,
      isBlockList: false,
      members: [UUID_1, UUID_1, UUID_2],
      senderKeyInfo: {
        createdAtDate: Date.now(),
        distributionId: getUuid(),
        memberDevices: []
      },
      storageID: getUuid(),
      storageVersion: 1,
      storageNeedsSync: false,
      storageUnknownFields: void 0,
      deletedAtTimestamp: void 0
    };
    await createNewStoryDistribution(list);
    import_chai.assert.lengthOf(await _getAllStoryDistributions(), 1);
    import_chai.assert.lengthOf(await _getAllStoryDistributionMembers(), 2);
    const allHydratedLists = await getAllStoryDistributionsWithMembers();
    import_chai.assert.lengthOf(allHydratedLists, 1);
    import_chai.assert.deepEqual(allHydratedLists[0].members, [UUID_1, UUID_2]);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RvcnlEaXN0cmlidXRpb25fdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcblxuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi4vLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5cbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUgfSBmcm9tICcuLi8uLi9zcWwvSW50ZXJmYWNlJztcblxuY29uc3Qge1xuICBfZGVsZXRlQWxsU3RvcnlEaXN0cmlidXRpb25zLFxuICBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25NZW1iZXJzLFxuICBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zLFxuICBjcmVhdGVOZXdTdG9yeURpc3RyaWJ1dGlvbixcbiAgZGVsZXRlU3RvcnlEaXN0cmlidXRpb24sXG4gIGdldEFsbFN0b3J5RGlzdHJpYnV0aW9uc1dpdGhNZW1iZXJzLFxuICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbixcbiAgbW9kaWZ5U3RvcnlEaXN0cmlidXRpb25NZW1iZXJzLFxuICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzLFxufSA9IGRhdGFJbnRlcmZhY2U7XG5cbmZ1bmN0aW9uIGdldFV1aWQoKTogVVVJRFN0cmluZ1R5cGUge1xuICByZXR1cm4gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG59XG5cbmRlc2NyaWJlKCdzcWwvc3RvcnlEaXN0cmlidXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IF9kZWxldGVBbGxTdG9yeURpc3RyaWJ1dGlvbnMoKTtcbiAgfSk7XG5cbiAgaXQoJ3JvdW5kdHJpcHMgd2l0aCBjcmVhdGUvZmV0Y2gvZGVsZXRlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGxpc3Q6IFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlID0ge1xuICAgICAgaWQ6IGdldFV1aWQoKSxcbiAgICAgIG5hbWU6ICdNeSBTdG9yeScsXG4gICAgICBhbGxvd3NSZXBsaWVzOiB0cnVlLFxuICAgICAgaXNCbG9ja0xpc3Q6IGZhbHNlLFxuICAgICAgbWVtYmVyczogW2dldFV1aWQoKSwgZ2V0VXVpZCgpXSxcbiAgICAgIHNlbmRlcktleUluZm86IHtcbiAgICAgICAgY3JlYXRlZEF0RGF0ZTogRGF0ZS5ub3coKSxcbiAgICAgICAgZGlzdHJpYnV0aW9uSWQ6IGdldFV1aWQoKSxcbiAgICAgICAgbWVtYmVyRGV2aWNlczogW10sXG4gICAgICB9LFxuICAgICAgc3RvcmFnZUlEOiBnZXRVdWlkKCksXG4gICAgICBzdG9yYWdlVmVyc2lvbjogMSxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IGZhbHNlLFxuICAgICAgc3RvcmFnZVVua25vd25GaWVsZHM6IHVuZGVmaW5lZCxcbiAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcDogdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICBhd2FpdCBjcmVhdGVOZXdTdG9yeURpc3RyaWJ1dGlvbihsaXN0KTtcblxuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zKCksIDEpO1xuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25NZW1iZXJzKCksIDIpO1xuXG4gICAgY29uc3QgYWxsSHlkcmF0ZWRMaXN0cyA9IGF3YWl0IGdldEFsbFN0b3J5RGlzdHJpYnV0aW9uc1dpdGhNZW1iZXJzKCk7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGFsbEh5ZHJhdGVkTGlzdHMsIDEpO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoYWxsSHlkcmF0ZWRMaXN0c1swXSwgbGlzdCk7XG5cbiAgICBhd2FpdCBkZWxldGVTdG9yeURpc3RyaWJ1dGlvbihsaXN0LmlkKTtcblxuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zKCksIDApO1xuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25NZW1iZXJzKCksIDApO1xuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnNXaXRoTWVtYmVycygpLCAwKTtcbiAgfSk7XG5cbiAgaXQoJ3VwZGF0ZXMgY29yZSBmaWVsZHMgd2l0aCBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBVVUlEXzEgPSBnZXRVdWlkKCk7XG4gICAgY29uc3QgVVVJRF8yID0gZ2V0VXVpZCgpO1xuICAgIGNvbnN0IGxpc3Q6IFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlID0ge1xuICAgICAgaWQ6IGdldFV1aWQoKSxcbiAgICAgIG5hbWU6ICdNeSBTdG9yeScsXG4gICAgICBhbGxvd3NSZXBsaWVzOiB0cnVlLFxuICAgICAgaXNCbG9ja0xpc3Q6IGZhbHNlLFxuICAgICAgbWVtYmVyczogW1VVSURfMSwgVVVJRF8yXSxcbiAgICAgIHNlbmRlcktleUluZm86IHtcbiAgICAgICAgY3JlYXRlZEF0RGF0ZTogRGF0ZS5ub3coKSxcbiAgICAgICAgZGlzdHJpYnV0aW9uSWQ6IGdldFV1aWQoKSxcbiAgICAgICAgbWVtYmVyRGV2aWNlczogW10sXG4gICAgICB9LFxuICAgICAgc3RvcmFnZUlEOiBnZXRVdWlkKCksXG4gICAgICBzdG9yYWdlVmVyc2lvbjogMSxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IGZhbHNlLFxuICAgICAgc3RvcmFnZVVua25vd25GaWVsZHM6IHVuZGVmaW5lZCxcbiAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcDogdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICBhd2FpdCBjcmVhdGVOZXdTdG9yeURpc3RyaWJ1dGlvbihsaXN0KTtcblxuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zKCksIDEpO1xuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25NZW1iZXJzKCksIDIpO1xuXG4gICAgY29uc3QgdXBkYXRlZCA9IHtcbiAgICAgIC4uLmxpc3QsXG4gICAgICBuYW1lOiAnVXBkYXRlZCBzdG9yeScsXG4gICAgICBzZW5kZXJLZXlJbmZvOiB7XG4gICAgICAgIGNyZWF0ZWRBdERhdGU6IERhdGUubm93KCkgKyAxMCxcbiAgICAgICAgZGlzdHJpYnV0aW9uSWQ6IGdldFV1aWQoKSxcbiAgICAgICAgbWVtYmVyRGV2aWNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogVVVJRF8xLFxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IDIzMixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXdhaXQgbW9kaWZ5U3RvcnlEaXN0cmlidXRpb24odXBkYXRlZCk7XG5cbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucygpLCAxKTtcbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycygpLCAyKTtcblxuICAgIGNvbnN0IGFsbEh5ZHJhdGVkTGlzdHMgPSBhd2FpdCBnZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnNXaXRoTWVtYmVycygpO1xuICAgIGFzc2VydC5sZW5ndGhPZihhbGxIeWRyYXRlZExpc3RzLCAxKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGFsbEh5ZHJhdGVkTGlzdHNbMF0sIHVwZGF0ZWQpO1xuICB9KTtcblxuICBpdCgnYWRkcyBhbmQgcmVtb3ZlcyB3aXRoIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBVVUlEXzEgPSBnZXRVdWlkKCk7XG4gICAgY29uc3QgVVVJRF8yID0gZ2V0VXVpZCgpO1xuICAgIGNvbnN0IFVVSURfMyA9IGdldFV1aWQoKTtcbiAgICBjb25zdCBVVUlEXzQgPSBnZXRVdWlkKCk7XG4gICAgY29uc3QgbGlzdDogU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUgPSB7XG4gICAgICBpZDogZ2V0VXVpZCgpLFxuICAgICAgbmFtZTogJ015IFN0b3J5JyxcbiAgICAgIGFsbG93c1JlcGxpZXM6IHRydWUsXG4gICAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgICBtZW1iZXJzOiBbVVVJRF8xLCBVVUlEXzJdLFxuICAgICAgc2VuZGVyS2V5SW5mbzoge1xuICAgICAgICBjcmVhdGVkQXREYXRlOiBEYXRlLm5vdygpLFxuICAgICAgICBkaXN0cmlidXRpb25JZDogZ2V0VXVpZCgpLFxuICAgICAgICBtZW1iZXJEZXZpY2VzOiBbXSxcbiAgICAgIH0sXG4gICAgICBzdG9yYWdlSUQ6IGdldFV1aWQoKSxcbiAgICAgIHN0b3JhZ2VWZXJzaW9uOiAxLFxuICAgICAgc3RvcmFnZU5lZWRzU3luYzogZmFsc2UsXG4gICAgICBzdG9yYWdlVW5rbm93bkZpZWxkczogdW5kZWZpbmVkLFxuICAgICAgZGVsZXRlZEF0VGltZXN0YW1wOiB1bmRlZmluZWQsXG4gICAgfTtcblxuICAgIGF3YWl0IGNyZWF0ZU5ld1N0b3J5RGlzdHJpYnV0aW9uKGxpc3QpO1xuXG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnMoKSwgMSk7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMoKSwgMik7XG5cbiAgICBhd2FpdCBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMobGlzdC5pZCwge1xuICAgICAgdG9BZGQ6IFtVVUlEXzMsIFVVSURfNF0sXG4gICAgICB0b1JlbW92ZTogW1VVSURfMV0sXG4gICAgfSk7XG5cbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucygpLCAxKTtcbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycygpLCAzKTtcblxuICAgIGNvbnN0IGFsbEh5ZHJhdGVkTGlzdHMgPSBhd2FpdCBnZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnNXaXRoTWVtYmVycygpO1xuICAgIGFzc2VydC5sZW5ndGhPZihhbGxIeWRyYXRlZExpc3RzLCAxKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGFsbEh5ZHJhdGVkTGlzdHNbMF0sIHtcbiAgICAgIC4uLmxpc3QsXG4gICAgICBtZW1iZXJzOiBbVVVJRF8yLCBVVUlEXzMsIFVVSURfNF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdhZGRzIGFuZCByZW1vdmVzIHdpdGggbW9kaWZ5U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBVVUlEXzEgPSBnZXRVdWlkKCk7XG4gICAgY29uc3QgVVVJRF8yID0gZ2V0VXVpZCgpO1xuICAgIGNvbnN0IFVVSURfMyA9IGdldFV1aWQoKTtcbiAgICBjb25zdCBVVUlEXzQgPSBnZXRVdWlkKCk7XG4gICAgY29uc3QgbGlzdDogU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUgPSB7XG4gICAgICBpZDogZ2V0VXVpZCgpLFxuICAgICAgbmFtZTogJ015IFN0b3J5JyxcbiAgICAgIGFsbG93c1JlcGxpZXM6IHRydWUsXG4gICAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgICBtZW1iZXJzOiBbVVVJRF8xLCBVVUlEXzJdLFxuICAgICAgc2VuZGVyS2V5SW5mbzoge1xuICAgICAgICBjcmVhdGVkQXREYXRlOiBEYXRlLm5vdygpLFxuICAgICAgICBkaXN0cmlidXRpb25JZDogZ2V0VXVpZCgpLFxuICAgICAgICBtZW1iZXJEZXZpY2VzOiBbXSxcbiAgICAgIH0sXG4gICAgICBzdG9yYWdlSUQ6IGdldFV1aWQoKSxcbiAgICAgIHN0b3JhZ2VWZXJzaW9uOiAxLFxuICAgICAgc3RvcmFnZU5lZWRzU3luYzogZmFsc2UsXG4gICAgICBzdG9yYWdlVW5rbm93bkZpZWxkczogdW5kZWZpbmVkLFxuICAgICAgZGVsZXRlZEF0VGltZXN0YW1wOiB1bmRlZmluZWQsXG4gICAgfTtcblxuICAgIGF3YWl0IGNyZWF0ZU5ld1N0b3J5RGlzdHJpYnV0aW9uKGxpc3QpO1xuXG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnMoKSwgMSk7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMoKSwgMik7XG5cbiAgICBhd2FpdCBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKGxpc3QsIHtcbiAgICAgIHRvQWRkOiBbVVVJRF8zLCBVVUlEXzRdLFxuICAgICAgdG9SZW1vdmU6IFtVVUlEXzFdLFxuICAgIH0pO1xuXG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnMoKSwgMSk7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMoKSwgMyk7XG5cbiAgICBjb25zdCBhbGxIeWRyYXRlZExpc3RzID0gYXdhaXQgZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zV2l0aE1lbWJlcnMoKTtcbiAgICBhc3NlcnQubGVuZ3RoT2YoYWxsSHlkcmF0ZWRMaXN0cywgMSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChhbGxIeWRyYXRlZExpc3RzWzBdLCB7XG4gICAgICAuLi5saXN0LFxuICAgICAgbWVtYmVyczogW1VVSURfMiwgVVVJRF8zLCBVVUlEXzRdLFxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZWxpbWluYXRlcyBkdXBsaWNhdGVzIHdpdGhvdXQgY29tcGxhaW50IGluIGNyZWF0ZU5ld1N0b3J5RGlzdHJpYnV0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFVVSURfMSA9IGdldFV1aWQoKTtcbiAgICBjb25zdCBVVUlEXzIgPSBnZXRVdWlkKCk7XG4gICAgY29uc3QgbGlzdDogU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUgPSB7XG4gICAgICBpZDogZ2V0VXVpZCgpLFxuICAgICAgbmFtZTogJ015IFN0b3J5JyxcbiAgICAgIGFsbG93c1JlcGxpZXM6IHRydWUsXG4gICAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgICBtZW1iZXJzOiBbVVVJRF8xLCBVVUlEXzEsIFVVSURfMl0sXG4gICAgICBzZW5kZXJLZXlJbmZvOiB7XG4gICAgICAgIGNyZWF0ZWRBdERhdGU6IERhdGUubm93KCksXG4gICAgICAgIGRpc3RyaWJ1dGlvbklkOiBnZXRVdWlkKCksXG4gICAgICAgIG1lbWJlckRldmljZXM6IFtdLFxuICAgICAgfSxcbiAgICAgIHN0b3JhZ2VJRDogZ2V0VXVpZCgpLFxuICAgICAgc3RvcmFnZVZlcnNpb246IDEsXG4gICAgICBzdG9yYWdlTmVlZHNTeW5jOiBmYWxzZSxcbiAgICAgIHN0b3JhZ2VVbmtub3duRmllbGRzOiB1bmRlZmluZWQsXG4gICAgICBkZWxldGVkQXRUaW1lc3RhbXA6IHVuZGVmaW5lZCxcbiAgICB9O1xuXG4gICAgYXdhaXQgY3JlYXRlTmV3U3RvcnlEaXN0cmlidXRpb24obGlzdCk7XG5cbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucygpLCAxKTtcbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycygpLCAyKTtcblxuICAgIGNvbnN0IGFsbEh5ZHJhdGVkTGlzdHMgPSBhd2FpdCBnZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnNXaXRoTWVtYmVycygpO1xuICAgIGFzc2VydC5sZW5ndGhPZihhbGxIeWRyYXRlZExpc3RzLCAxKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGFsbEh5ZHJhdGVkTGlzdHNbMF0ubWVtYmVycywgW1VVSURfMSwgVVVJRF8yXSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esa0JBQXVCO0FBRXZCLG9CQUEwQjtBQUMxQixrQkFBcUI7QUFLckIsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLElBQ0U7QUFFSixtQkFBbUM7QUFDakMsU0FBTyxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUNsQztBQUZTLEFBSVQsU0FBUyx5QkFBeUIsTUFBTTtBQUN0QyxhQUFXLFlBQVk7QUFDckIsVUFBTSw2QkFBNkI7QUFBQSxFQUNyQyxDQUFDO0FBRUQsS0FBRyx1Q0FBdUMsWUFBWTtBQUNwRCxVQUFNLE9BQXlDO0FBQUEsTUFDN0MsSUFBSSxRQUFRO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixlQUFlO0FBQUEsTUFDZixhQUFhO0FBQUEsTUFDYixTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUFBLE1BQzlCLGVBQWU7QUFBQSxRQUNiLGVBQWUsS0FBSyxJQUFJO0FBQUEsUUFDeEIsZ0JBQWdCLFFBQVE7QUFBQSxRQUN4QixlQUFlLENBQUM7QUFBQSxNQUNsQjtBQUFBLE1BQ0EsV0FBVyxRQUFRO0FBQUEsTUFDbkIsZ0JBQWdCO0FBQUEsTUFDaEIsa0JBQWtCO0FBQUEsTUFDbEIsc0JBQXNCO0FBQUEsTUFDdEIsb0JBQW9CO0FBQUEsSUFDdEI7QUFFQSxVQUFNLDJCQUEyQixJQUFJO0FBRXJDLHVCQUFPLFNBQVMsTUFB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
