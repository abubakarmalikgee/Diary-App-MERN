export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Handle filter, pagination, and sorting
  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields for pagination
    const removeFields = ["page", "limit", "sort"];
    removeFields.forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);

    // Convert to MongoDB style query
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Convert queryCopy back to object for additional processing
    const parsedQuery = JSON.parse(queryStr);

    // Handle startDate and endDate
    if (queryCopy.startDate || queryCopy.endDate) {
      parsedQuery.date = {};

      const startDate = queryCopy.startDate;
      const endDate = queryCopy.endDate;

      if (startDate) {
        parsedQuery.date.$gte = new Date(`${startDate}T00:00:00.000Z`);
      }

      if (endDate) {
        parsedQuery.date.$lte = new Date(`${endDate}T23:59:59.999Z`);
      }

      // Remove startDate and endDate from the original queryCopy
      delete parsedQuery.startDate;
      delete parsedQuery.endDate;
    }

    // Apply filters to query
    this.query = this.query.find(parsedQuery);
    return this;
  }

  // Handle sorting
  sort() {
    if (this.queryStr && this.queryStr.sort) {
      let sortBy;

      if (Array.isArray(this.queryStr.sort)) {
        // If it's an array, join the array elements with a space
        sortBy = this.queryStr.sort.join(" ");
      } else {
        // If it's a single string, proceed with split
        sortBy = this.queryStr.sort.split(",").join(" ");
      }

      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  // Handle pagination
  paginate() {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
