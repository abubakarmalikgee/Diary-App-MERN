import { Query } from "mongoose";

export class ApiFeatures {
  query: any;
  queryStr: Record<string, string | string[] | undefined>;

  constructor(
    query: any,
    queryStr: Record<string, string | string[] | undefined>
  ) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Handle filter, pagination and sorting
  public filter() {
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

    // Apply filters to query
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Handle sorting
  public sort() {
    if (this.queryStr && this.queryStr.sort) {
      let sortBy: string;

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
  public paginate() {
    const page = parseInt(this.queryStr.page as string, 10) || 1;
    const limit = parseInt(this.queryStr.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// // ApiFeatures.ts
// export class ApiFeatures {
//   query: any;
//   queryStr: Record<string, string | string[] | undefined>;

//   constructor(
//     query: any,
//     queryStr: Record<string, string | string[] | undefined>
//   ) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   // Handle filter
//   public filter() {
//     const queryCopy = { ...this.queryStr }; // Error fixed by ensuring the correct type for queryStr

//     // Remove pagination fields
//     const removeFields = ["page", "limit", "sort"];
//     removeFields.forEach((el) => delete queryCopy[el]);

//     let queryStr = JSON.stringify(queryCopy);

//     // Convert to MongoDB style query (e.g., $gt, $lt)
//     queryStr = queryStr.replace(
//       /\b(gt|gte|lt|lte|in)\b/g,
//       (match) => `$${match}`
//     );

//     // Apply filters to query
//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   // Handle sorting
//   public sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(",").join(" ");
//       this.query = this.query.sort(sortBy);
//     }
//     return this;
//   }

//   // Handle pagination
//   public paginate() {
//     const page = parseInt(this.queryStr.page as string, 10) || 1;
//     const limit = parseInt(this.queryStr.limit as string, 10) || 10;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }
// }
