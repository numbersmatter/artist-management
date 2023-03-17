import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  db, SubmittedIntentDoc,
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

  const errorIntentDoc: SubmittedIntentDoc = {
    createdAt:  Timestamp.now(),
    humanReadableId: "error finding intent-id",
    opportunityId: "error",
    status: "submitted",
    submittedAt: Timestamp.now()

  }


  const holdStatuses = artistStatuses
    .filter((doc) => doc.reviewStatus === "hold")
    .map((doc) => {
      const intentDoc = submittedIntents.find(
        (intent) => intent.intentId === doc.statusId
      );
      const docExists = intentDoc ?? errorIntentDoc;

      return { ...docExists, displayCreated: `${docExists.createdAt.toDate().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})} ${docExists.createdAt.toDate().toLocaleTimeString()}`};
    });
  const acceptedStatuses = artistStatuses
    .filter((doc) => doc.reviewStatus === "accepted")
    .map((doc) => {
      const intentDoc = submittedIntents.find(
        (intent) => intent.intentId === doc.statusId
      );
      const docExists = intentDoc ?? errorIntentDoc;

      return { ...docExists, displayCreated: `${docExists.createdAt.toDate().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})} ${docExists.createdAt.toDate().toLocaleTimeString()}`};

    });
  const declinedStatuses = artistStatuses
    .filter((doc) => doc.reviewStatus === "declined")
    .map((doc) => {
      const intentDoc = submittedIntents.find(
        (intent) => intent.intentId === doc.statusId
      );
      const docExists = intentDoc ?? errorIntentDoc;

      return { ...docExists, displayCreated: `${docExists.createdAt.toDate().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})} ${docExists.createdAt.toDate().toLocaleTimeString()}`};

    });

  const submittedIds = submittedIntents.map((doc) => doc.intentId);
  const hasStatusIds = artistStatuses.map((doc) => doc.statusId);

  const needsReviewIds = submittedIds.filter(
    (id) => !hasStatusIds.includes(id)
  );

  const needsReviewStatuses = submittedIntents
  .filter((intentDoc)=>  needsReviewIds.includes(intentDoc.intentId))
  .map((intentDoc)=>({...intentDoc, displayCreated:`${intentDoc.createdAt.toDate().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})} ${intentDoc.createdAt.toDate().toLocaleTimeString()}` }));

  // const needsReviewStatuses = needsReviewIds.map((id) => {
  //   const intentDoc = submittedIntents.find((intent) => intent.intentId === id);
    

  //   return { ...intentDoc, intentId: id };
  // });

  const intents= {
    review: needsReviewStatuses,
    hold: holdStatuses,
    accepted: acceptedStatuses,
    declined: declinedStatuses,
  };

  return intents;
};
