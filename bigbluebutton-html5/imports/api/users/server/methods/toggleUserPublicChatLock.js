import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';
import { check } from 'meteor/check';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function changeUserPublicChatLock(userId, lock) {

  const { meetingId, requesterUserId: lockedBy } = extractCredentials(this.userId);

  check(lockedBy, String);
  check(userId, String);
  check(lock, Boolean);

  const selector = {
    meetingId,
    userId,
  };

  const modifier = {
    $set: {
        blockPublicChat:lock,
    },
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Changing user lock setting: ${err}`);
    }

    if (!numChanged) {
      return Logger.info(`User's userId=${userId} public chat lock status wasn't updated`);
    }

    return Logger.info(`User's userId=${userId} public chat lock status was changed to: ${lock} by user userId=${lockedBy}`);
  };

  return Users.update(selector, modifier, cb);
}
