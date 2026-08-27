import { experience } from "./documents/experience";
import { profile } from "./documents/profile";
import { project } from "./documents/project";
import { socialLink } from "./documents/socialLink";
import { collaborator } from "./objects/collaborator";
import { educationEntry } from "./objects/educationEntry";
import { externalLink } from "./objects/externalLink";
import { galleryImage } from "./objects/galleryImage";
import { portableText } from "./objects/portableText";
import { resumeResource } from "./objects/resumeResource";
import { seoMetadata } from "./objects/seoMetadata";

export const schemaTypes = [
  profile,
  project,
  experience,
  socialLink,
  collaborator,
  educationEntry,
  externalLink,
  galleryImage,
  portableText,
  resumeResource,
  seoMetadata,
];
