import { FieldValue } from "firebase-admin/firestore";
import { db, ImageObject } from "./db.server";
// @ts-ignore
import * as hri from "human-readable-ids";

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
  profileId: string, opportunityId:string
) => {
  const artistStatusesRef = db.artistReview(profileId).where("opportunityId", "==", opportunityId)

  const artistStatusesSnap = await artistStatusesRef.get();

  const artistStatuses = artistStatusesSnap.docs.map(
    (snap)=>({...snap.data(), statusId: snap.id})
  );

  return artistStatuses;
};

export const changeReviewStatus = async (
  profileId: string,
  intentId: string,
  opportunityId: string,
  humanReadableId:string,
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

export const createMilaIntent = async (
  profileId: string,
  opportunityId: string
) => {
  const intentRef = db.intents(profileId).doc();

  const defaultData = {
    opportunityId: opportunityId,
    createdAt: FieldValue.serverTimestamp(),
    humanReadableId: hri.hri.random(),
    status: "in-progress",
    questionOrder: [],
    questionStatus: {},
  };

  //  @ts-expect-error
  const writeResult = await intentRef.create(defaultData);

  return { ...writeResult, intentId: intentRef.id };
};

export const readIntentDoc = async (profileId: string, intentId: string) => {
  const intentRef = db.intents(profileId).doc(intentId);
  const intentSnap = await intentRef.get();
  const intentData = intentSnap.data();

  if (!intentData) {
    return undefined;
  }

  return { ...intentData, intentId };
};

export const getAllIntents = async (profileId: string) => {
  const intentsRef = db.intents(profileId).where("status", "==", "submitted");
  const intentsSnap = await intentsRef.get();

  const intentsDocs = intentsSnap.docs
  .map((snap) => ({ ...snap.data(), intentId: snap.id }))
  // @ts-ignore
    .sort((a, b) => b.submittedAt?.seconds - a.submittedAt?.seconds);

  return intentsDocs;
};

export const getIntentResponses = async (
  profileId: string,
  intentId: string
) => {
  const intentResponseSnap = await db.responses(profileId, intentId).get();

  const responseData = intentResponseSnap.docs.map((docSnap) => ({
    ...docSnap.data(),
    docId: docSnap.id,
  }));

  return responseData;
};

export const isIntentValid = async (profileId: string, intentId: string) => {
  const intentDoc = await readIntentDoc(profileId, intentId);

  if (!intentDoc) {
    return "invalid";
  }

  return intentDoc.status;
};

export const submitIntent = async (profileId: string, intentId: string) => {
  // setFrom status to submitted
  // 1 get intent ref
  const intentRef = db.intents(profileId).doc(intentId);
  const updateData = {
    status: "submitted",
    submittedAt: FieldValue.serverTimestamp(),
  };

  // @ts-ignore
  return await intentRef.update(updateData);
};

export const saveMilaResponse = async (
  profileId: string,
  intentId: string,
  stepId: string,
  data: { [key: string]: string }
) => {
  const responseDocRef = db.responses(profileId, intentId).doc(stepId);
  const writeData = {
    fieldResponses: data,
  };
  const writeResult = await responseDocRef.set(writeData);

  return writeResult;
};
export const saveMilaImageUpload = async (
  profileId: string,
  intentId: string,
  stepId: string,
  imageObj: {
    url: string;
    description: string;
  }
) => {
  const responseDocRef = db.imgUploads(profileId, intentId).doc(stepId);

  const imageId = db.profile().doc().id;

  const imageData = {
    ...imageObj,
    imageId,
  };

  const writeData = {
    imgList: FieldValue.arrayUnion(imageData),
  };

  //  @ts-ignore
  const writeResult = await responseDocRef.set(writeData, { merge: true });

  return writeResult;
};

export const deleteMilaImageUpload = async (
  profileId: string,
  intentId: string,
  stepId: string,
  imageData: { imageId: string; description: string; url: string }
) => {
  const responseDocRef = db.imgUploads(profileId, intentId).doc(stepId);

  const writeData = {
    imgList: FieldValue.arrayRemove(imageData),
  };

  //  @ts-ignore
  const writeResult = await responseDocRef.update(writeData);

  return writeResult;
};

export const readMilaImageUpload = async (
  profileId: string,
  intentId: string,
  stepId: string
) => {
  const responseRef = db.imgUploads(profileId, intentId).doc(stepId);
  const responseSnap = await responseRef.get();
  const responseData = responseSnap.data();

  if (!responseData) {
    return undefined;
  }

  return responseData;
};
export const readMilaResponse = async (
  profileId: string,
  intentId: string,
  stepId: string
) => {
  const responseRef = db.responses(profileId, intentId).doc(stepId);
  const responseSnap = await responseRef.get();
  const responseData = responseSnap.data();

  if (!responseData) {
    return undefined;
  }

  return responseData;
};
