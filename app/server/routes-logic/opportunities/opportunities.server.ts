import { FieldValue } from "firebase-admin/firestore";
import {
  db,
} from "~/server/db.server";

export const getSubmittedIntents = async (
  profileId: string,
  opportunityId: string
) => {
  const submittedIntentRef = db
    .submittedIntents(profileId)
    .where("opportunityId", "==", opportunityId);
  const submittedIntentsSnap = await submittedIntentRef.get();

  const submittedIntents = submittedIntentsSnap.docs
    .map((snap) => ({ ...snap.data(), intentId: snap.id }))
    .sort((a, b) => b.submittedAt.seconds - a.submittedAt.seconds);

  return submittedIntents;
};

export const getAllOportunities = async (profileId: string) => {
  const opportunitiesRef = db.opportunites(profileId);
  const opportunitesSnap = await opportunitiesRef.get();

  const opportunites = opportunitesSnap.docs.map((OppSnap) => ({
    ...OppSnap.data(),
    opportunityId: OppSnap.id,
  }));
  return opportunites;
};

export const getAllArtistStatuses = async (
  profileId: string,
  opportunityId: string
) => {
  const artistStatusesRef = db
    .artistReview(profileId)
    .where("opportunityId", "==", opportunityId);

  const artistStatusesSnap = await artistStatusesRef.get();

  const artistStatuses = artistStatusesSnap.docs.map((snap) => ({
    ...snap.data(),
    statusId: snap.id,
  }));

  return artistStatuses;
};

export const changeReviewStatus = async (
  profileId: string,
  intentId: string,
  opportunityId: string,
  humanReadableId: string,
  newStatus: "accepted" | "hold" | "declined"
) => {
  const artistReviewRef = db.artistReview(profileId).doc(intentId);

  const updateData = {
    reviewStatus: newStatus,
    opportunityId: opportunityId,
    reviewLastUpdated: FieldValue.serverTimestamp(),
    humanReadableId,
  };
  const writeResult = await artistReviewRef.set(updateData, { merge: true });

  return { writeResult };
};

export const getOpportunityStatusLists = async (
  profileId: string,
  opportunityId: string
) => {

  const [artistStatuses, submittedIntents] = await Promise.all([
    getAllArtistStatuses("milachu92", opportunityId),
    getSubmittedIntents(profileId, opportunityId),
  ]);


  const holdStatuses = artistStatuses
    .filter((doc) => doc.reviewStatus === "hold")
    .map((doc) => {
      const intentDoc = submittedIntents.find(
        (intent) => intent.intentId === doc.statusId
      );
      return { ...intentDoc };
    });
  const acceptedStatuses = artistStatuses
    .filter((doc) => doc.reviewStatus === "accepted")
    .map((doc) => {
      const intentDoc = submittedIntents.find(
        (intent) => intent.intentId === doc.statusId
      );
      return { ...intentDoc };
    });
  const declinedStatuses = artistStatuses
    .filter((doc) => doc.reviewStatus === "declined")
    .map((doc) => {
      const intentDoc = submittedIntents.find(
        (intent) => intent.intentId === doc.statusId
      );
      return { ...intentDoc };
    });

  const submittedIds = submittedIntents.map((doc) => doc.intentId);
  const hasStatusIds = artistStatuses.map((doc) => doc.statusId);

  const needsReviewIds = submittedIds.filter(
    (id) => !hasStatusIds.includes(id)
  );

  const needsReviewStatuses = needsReviewIds.map((id) => {
    const intentDoc = submittedIntents.find((intent) => intent.intentId === id);

    return { ...intentDoc, intentId: id };
  });

  return { needsReviewStatuses, holdStatuses, acceptedStatuses, declinedStatuses}
};
