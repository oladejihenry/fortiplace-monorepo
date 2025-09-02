import { nanoid } from "nanoid"

export function generateTemporaryId() {
  return `temp_${nanoid(12)}`
}
