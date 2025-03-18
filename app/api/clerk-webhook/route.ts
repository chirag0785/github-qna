import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { nanoid } from '@/lib/utils';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET!;
    
  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  const wh = new Webhook(SIGNING_SECRET)
  
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }


  const { id } = evt.data
  const eventType = evt.type
  if(evt.type==='user.created'){        //sync with the user database
      //check if user already exists
      const userList=await db.select().from(users).where(eq(users.email,evt.data?.email_addresses?.[0]?.email_address)).limit(1);
      if(userList.length>0){
          console.log("User already exists in database");
          return new Response('Webhook received', { status: 200 });
      }
      await db.insert(users).values({
        id: evt.data?.id || nanoid(),  // Use nanoid if ID is missing
        name: `${evt.data?.first_name || ""} ${evt.data?.last_name || ""}`.trim(),
        email: evt.data?.email_addresses?.[0]?.email_address || "",
        username: evt.data?.username || "",
        profile_img: evt.data?.image_url || "",
    });    
      console.log("User stored in database");
      return new Response('Webhook received', { status: 200 })
  }

  if(evt.type==='user.deleted'){
      //delete the user from the database
      const userList=await db.select().from(users).where(eq(users.id,evt.data?.id || "")).limit(1);
      if(userList.length==0){
          console.log("User doesn't exist in database");
          return new Response('Webhook received', { status: 404 });
      }
      await db.delete(users).where(eq(users.id,evt.data?.id || ""));
      console.log("User deleted from database");
      return new Response('Webhook received', { status: 200 })
  }
  return new Response('Webhook received', { status: 200 })
}