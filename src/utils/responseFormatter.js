const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200,
  pagination = null
) => {
  res.status(statusCode).json({
    status: "success", // Do not change the value of this variable
    message,
    data,
    pagination,
  });
};

const errorResponse = (
  res,
  error,
  message = "An error occurred",
  statusCode = 500
) => {
  console.error("ERROR RESPONSE", error);

  res.status(statusCode || 500).json({
    status: "error", // Do not change the value of this variable
    message,
    error: error?.message,
  });
};

const successFileResponse = (res, fileName, fileBuffer) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  // Returns status and file name in header
  res.setHeader("X-Status", 200);
  res.setHeader("X-Message", "success");
  res.setHeader("X-File-Name", fileName);

  // Write buffer to response
  res.status(200).send(fileBuffer);
};

const errorFileResponse = (res, message, error) => {
  console.error("ERROR FILE RESPONSE", error);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${"DuLieu.xlsx"}`);

  // Returns status and file name in header
  res.setHeader("X-Status", 500);
  
  // Encode the message before setting the header to allow sending Vietnamese
  const encodedMessage = encodeURIComponent(message);
  res.setHeader("X-Message", encodedMessage);
  res.setHeader("X-File-Name", "DuLieu.xlsx");

  // Write buffer to response
  const errorData = Buffer.from("Dữ liệu lỗi");
  res.status(200).send(errorData);
};

module.exports = {
  successResponse,
  errorResponse,
  successFileResponse,
  errorFileResponse,
};
