import {connect} from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import updated from "@/models/updateduserSchema"
connect();
export async function GET(request: NextRequest) {
	try {
        const userData = await updated.find({}, 'name email employee_id isVerified');
        return NextResponse.json({
            message: "Successfully retrieve user data",
            success: true,
            user: userData,
          });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
        
	}
}