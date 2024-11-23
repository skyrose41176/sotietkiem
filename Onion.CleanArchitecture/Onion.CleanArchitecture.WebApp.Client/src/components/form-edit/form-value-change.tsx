export const FormValueChange = (
  initialValues: any,
  changedValues: any,
  allValues: any,
  changedFields: any
) => {
  const objectKeyChanges = Object.keys(changedValues);
  const updatedFields = [...changedFields];

  const hasChanged = objectKeyChanges.some(
    (key) => initialValues[key] !== allValues[key]
  );
  const firstChangedKey = objectKeyChanges[0];

  if (hasChanged && !updatedFields.includes(firstChangedKey)) {
    updatedFields.push(firstChangedKey);
  } else if (!hasChanged) {
    return {
      hasChanged: false,
      updatedFields: updatedFields.filter((item) => item !== firstChangedKey),
    };
  }

  return { hasChanged, updatedFields };
};
