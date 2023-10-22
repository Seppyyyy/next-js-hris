import { getUserFromToken } from '@/helpers/getCustomTokenFromToken';
import { NextRequest, NextResponse } from 'next/server';
import pay from '@/models/paySchema';
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function GET(request: NextRequest) {
	try {
        const userId = await getUserFromToken(request);
        const userData = await pay.findOne({employee_id:userId})
        console.log('this is the user variable', userData);
        return NextResponse.json({message: "Successfully retrieve user data", success: true, user: userData});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}