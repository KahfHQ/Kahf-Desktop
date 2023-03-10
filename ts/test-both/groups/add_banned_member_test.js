var import_chai = require("chai");
var import_UUID = require("../../types/UUID");
var import_groups = require("../../groups");
var import_zkgroup = require("../../util/zkgroup");
var import_RemoteConfigStub = require("../helpers/RemoteConfigStub");
const HARD_LIMIT_KEY = "global.groupsv2.groupSizeHardLimit";
describe("group add banned member", () => {
  const uuid = import_UUID.UUID.generate();
  const ourUuid = import_UUID.UUID.generate();
  const existing = Array.from({ length: 10 }, (_, index) => ({
    uuid: import_UUID.UUID.generate().toString(),
    timestamp: index
  }));
  const secretParams = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAd/rq8//fR4RzhvN3G9KcKlQoj7cguQFjTOqLV6JUSbrURzeILsUmsymGJmHt3kpBJ2zosqp4exsg+qwF1z6YdB/rxKnxKRLZZP/V0F7bERslYILy2lUh3Sh3iA98yO4CGfzjjFVo1SI7U8XApLeVNQHJo7nkflf/JyBrqPft5gEucbKW/h+S3OYjfQ5zl2Cpw3XrV7N6OKEutLUWPHQuJx11A4xDPrmtAOnGy2NBxoOybDNlWipeNbn1WQJqOjMF7YA80oEm+5qnMkEYcFVqbYaSzPcMhg3mQ0SYfQpxYgSOJpwp9f/8EDnwJV4ISPBOo2CiaSqVfnd8DwZOc58gQA==";
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  before(async () => {
    await (0, import_RemoteConfigStub.updateRemoteConfig)([
      { name: HARD_LIMIT_KEY, value: "5", enabled: true }
    ]);
  });
  it("should add banned member without deleting", () => {
    const actions = (0, import_groups._maybeBuildAddBannedMemberActions)({
      clientZkGroupCipher,
      uuid,
      ourUuid,
      group: {
        bannedMembersV2: []
      }
    });
    import_chai.assert.strictEqual(actions.addMembersBanned?.length, 1);
    import_chai.assert.strictEqual((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, actions.addMembersBanned?.[0]?.added?.userId ?? new Uint8Array(0)), uuid.toString());
    import_chai.assert.strictEqual(actions.deleteMembersBanned, null);
  });
  it("should add banned member while deleting the oldest", () => {
    const actions = (0, import_groups._maybeBuildAddBannedMemberActions)({
      clientZkGroupCipher,
      uuid,
      ourUuid,
      group: {
        bannedMembersV2: [...existing]
      }
    });
    const deleted = actions.deleteMembersBanned?.map(({ deletedUserId }) => {
      return (0, import_zkgroup.decryptUuid)(clientZkGroupCipher, deletedUserId ?? new Uint8Array(0));
    });
    import_chai.assert.strictEqual(actions.addMembersBanned?.length, 1);
    import_chai.assert.strictEqual((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, actions.addMembersBanned?.[0]?.added?.userId ?? new Uint8Array(0)), uuid.toString());
    import_chai.assert.deepStrictEqual(deleted, existing.slice(0, 6).reverse().map((member) => member.uuid));
  });
  it("should not ban ourselves", () => {
    const actions = (0, import_groups._maybeBuildAddBannedMemberActions)({
      clientZkGroupCipher,
      uuid: ourUuid,
      ourUuid,
      group: {
        bannedMembersV2: []
      }
    });
    import_chai.assert.isUndefined(actions.addMembersBanned);
    import_chai.assert.isUndefined(actions.deleteMembersBanned);
  });
  it("should not ban already banned person", () => {
    const actions = (0, import_groups._maybeBuildAddBannedMemberActions)({
      clientZkGroupCipher,
      uuid,
      ourUuid,
      group: {
        bannedMembersV2: [{ uuid: uuid.toString(), timestamp: 1 }]
      }
    });
    import_chai.assert.isUndefined(actions.addMembersBanned);
    import_chai.assert.isUndefined(actions.deleteMembersBanned);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWRkX2Jhbm5lZF9tZW1iZXJfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgX21heWJlQnVpbGRBZGRCYW5uZWRNZW1iZXJBY3Rpb25zIH0gZnJvbSAnLi4vLi4vZ3JvdXBzJztcbmltcG9ydCB7IGdldENsaWVudFprR3JvdXBDaXBoZXIsIGRlY3J5cHRVdWlkIH0gZnJvbSAnLi4vLi4vdXRpbC96a2dyb3VwJztcbmltcG9ydCB7IHVwZGF0ZVJlbW90ZUNvbmZpZyB9IGZyb20gJy4uL2hlbHBlcnMvUmVtb3RlQ29uZmlnU3R1Yic7XG5cbmNvbnN0IEhBUkRfTElNSVRfS0VZID0gJ2dsb2JhbC5ncm91cHN2Mi5ncm91cFNpemVIYXJkTGltaXQnO1xuXG5kZXNjcmliZSgnZ3JvdXAgYWRkIGJhbm5lZCBtZW1iZXInLCAoKSA9PiB7XG4gIGNvbnN0IHV1aWQgPSBVVUlELmdlbmVyYXRlKCk7XG4gIGNvbnN0IG91clV1aWQgPSBVVUlELmdlbmVyYXRlKCk7XG4gIGNvbnN0IGV4aXN0aW5nID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGluZGV4KSA9PiAoe1xuICAgIHV1aWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIHRpbWVzdGFtcDogaW5kZXgsXG4gIH0pKTtcbiAgY29uc3Qgc2VjcmV0UGFyYW1zID1cbiAgICAnQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFkL3JxOC8vZlInICtcbiAgICAnNFJ6aHZOM0c5S2NLbFFvajdjZ3VRRmpUT3FMVjZKVVNiclVSemVJTHNVbXN5bUdKbUh0M2twQkoyem9zcXA0ZXgnICtcbiAgICAnc2crcXdGMXo2WWRCL3J4S254S1JMWlpQL1YwRjdiRVJzbFlJTHkybFVoM1NoM2lBOTh5TzRDR2Z6ampGVm8xU0knICtcbiAgICAnN1U4WEFwTGVWTlFISm83bmtmbGYvSnlCcnFQZnQ1Z0V1Y2JLVy9oK1MzT1lqZlE1emwyQ3B3M1hyVjdONk9LRXUnICtcbiAgICAndExVV1BIUXVKeDExQTR4RFBybXRBT25HeTJOQnhvT3liRE5sV2lwZU5ibjFXUUpxT2pNRjdZQTgwb0VtKzVxbk0nICtcbiAgICAna0VZY0ZWcWJZYVN6UGNNaGczbVEwU1lmUXB4WWdTT0pwd3A5Zi84RURud0pWNElTUEJPbzJDaWFTcVZmbmQ4RHcnICtcbiAgICAnWk9jNThnUUE9PSc7XG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKHNlY3JldFBhcmFtcyk7XG5cbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB1cGRhdGVSZW1vdGVDb25maWcoW1xuICAgICAgeyBuYW1lOiBIQVJEX0xJTUlUX0tFWSwgdmFsdWU6ICc1JywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBiYW5uZWQgbWVtYmVyIHdpdGhvdXQgZGVsZXRpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IF9tYXliZUJ1aWxkQWRkQmFubmVkTWVtYmVyQWN0aW9ucyh7XG4gICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgdXVpZCxcbiAgICAgIG91clV1aWQsXG4gICAgICBncm91cDoge1xuICAgICAgICBiYW5uZWRNZW1iZXJzVjI6IFtdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3Rpb25zLmFkZE1lbWJlcnNCYW5uZWQ/Lmxlbmd0aCwgMSk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgZGVjcnlwdFV1aWQoXG4gICAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICAgIGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZD8uWzBdPy5hZGRlZD8udXNlcklkID8/IG5ldyBVaW50OEFycmF5KDApXG4gICAgICApLFxuICAgICAgdXVpZC50b1N0cmluZygpXG4gICAgKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0aW9ucy5kZWxldGVNZW1iZXJzQmFubmVkLCBudWxsKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgYmFubmVkIG1lbWJlciB3aGlsZSBkZWxldGluZyB0aGUgb2xkZXN0JywgKCkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBfbWF5YmVCdWlsZEFkZEJhbm5lZE1lbWJlckFjdGlvbnMoe1xuICAgICAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgICAgIHV1aWQsXG4gICAgICBvdXJVdWlkLFxuICAgICAgZ3JvdXA6IHtcbiAgICAgICAgYmFubmVkTWVtYmVyc1YyOiBbLi4uZXhpc3RpbmddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlbGV0ZWQgPSBhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQ/Lm1hcCgoeyBkZWxldGVkVXNlcklkIH0pID0+IHtcbiAgICAgIHJldHVybiBkZWNyeXB0VXVpZChcbiAgICAgICAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgICAgICAgZGVsZXRlZFVzZXJJZCA/PyBuZXcgVWludDhBcnJheSgwKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3Rpb25zLmFkZE1lbWJlcnNCYW5uZWQ/Lmxlbmd0aCwgMSk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgZGVjcnlwdFV1aWQoXG4gICAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICAgIGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZD8uWzBdPy5hZGRlZD8udXNlcklkID8/IG5ldyBVaW50OEFycmF5KDApXG4gICAgICApLFxuICAgICAgdXVpZC50b1N0cmluZygpXG4gICAgKTtcbiAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICAgICAgZGVsZXRlZCxcbiAgICAgIGV4aXN0aW5nXG4gICAgICAgIC5zbGljZSgwLCA2KVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5tYXAobWVtYmVyID0+IG1lbWJlci51dWlkKVxuICAgICk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IGJhbiBvdXJzZWx2ZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IF9tYXliZUJ1aWxkQWRkQmFubmVkTWVtYmVyQWN0aW9ucyh7XG4gICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgdXVpZDogb3VyVXVpZCxcbiAgICAgIG91clV1aWQsXG4gICAgICBncm91cDoge1xuICAgICAgICBiYW5uZWRNZW1iZXJzVjI6IFtdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGFzc2VydC5pc1VuZGVmaW5lZChhY3Rpb25zLmFkZE1lbWJlcnNCYW5uZWQpO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG5vdCBiYW4gYWxyZWFkeSBiYW5uZWQgcGVyc29uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBfbWF5YmVCdWlsZEFkZEJhbm5lZE1lbWJlckFjdGlvbnMoe1xuICAgICAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgICAgIHV1aWQsXG4gICAgICBvdXJVdWlkLFxuICAgICAgZ3JvdXA6IHtcbiAgICAgICAgYmFubmVkTWVtYmVyc1YyOiBbeyB1dWlkOiB1dWlkLnRvU3RyaW5nKCksIHRpbWVzdGFtcDogMSB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoYWN0aW9ucy5hZGRNZW1iZXJzQmFubmVkKTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoYWN0aW9ucy5kZWxldGVNZW1i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
