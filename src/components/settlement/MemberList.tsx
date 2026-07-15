import React from 'react'
import Avatar from '@/components/Avatar'
import { Member } from '@/types/settlement';

type Props = {
    members: Member[]
    action?: (member:Member)=>React.ReactNode;
}

export const MemberList = ({members, action}: Props) => {

  return (
        
        <section className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">
          成员列表
        </h2>

        <div className="space-y-3">

          {
            members.map(member => (

              <div
                key={member.id}
                className="
                  flex items-center justify-between
                  bg-gray-50 rounded-xl
                  px-4 py-3
                "
              >
                <div className="flex items-center gap-3">

                  <Avatar
                    avatar={member.avatar}
                    username={member.username}
                  />

                  <span className="font-medium">
                    {member.username}
                  </span>

                </div>

                <div>
                    <span className="
                    px-3 py-1
                    rounded-full
                    bg-white
                    text-sm
                    text-gray-500
                    mr-2
                    ">
                    {member.role}
                    </span>

                    {
                    action?.(member)
                    }
                </div>

              </div>

            ))
          }
        </div>
      </section>
  )
}