export default async ({
  request,
  setLoading,
  setError,
  warnErrorText,
  payload,
  errorPlaceholder = 'Server error',
}) => {
  try {
    if (setLoading) {
      setLoading(true);
    }
    return await request(payload);
  } catch (e) {
    console.log(JSON.stringify(e), warnErrorText);
    // console.warn(e?.response?.data);
    if (setError) {
      setError(e?.response?.data || errorPlaceholder);
    }
    return {};
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
