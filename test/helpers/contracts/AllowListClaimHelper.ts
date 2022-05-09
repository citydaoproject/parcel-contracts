import { DateTime } from 'luxon';
import { convertToClaimPeriodTimestamp } from '../../../src/contracts/AllowListClaim';
import { ParcelNFT } from '../../../types/contracts';

export const setValidClaimPeriod = async (parcelNFT: ParcelNFT) => {
  const now = DateTime.now();
  await parcelNFT.setClaimPeriod(
    convertToClaimPeriodTimestamp(now.minus({ minutes: 1 })),
    convertToClaimPeriodTimestamp(now.plus({ hour: 1 })),
  );
};
