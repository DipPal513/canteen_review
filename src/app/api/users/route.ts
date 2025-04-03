import { connectDB } from "@/src/db/connection";
import User from "@/src/models/user.model"; // Assuming you have a User model

export async function GET(req: any) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    // Fetch users with populated reviews and apply pagination
    const users = await User.find()
    .populate("reviews", null, null, { strictPopulate: false })
    // Assuming "reviews" is the field in User schema
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    return Response.json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
