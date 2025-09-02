import { AvatarFallback } from '@workspace/ui/components/avatar'

import { Avatar } from '@workspace/ui/components/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { ScrollArea } from '@workspace/ui/components/scroll-area'

export default function RecentActivities() {
  const recentActivities = [
    { user: 'John Doe', action: 'Published a new product', time: '2 hours ago' },
    { user: 'Jane Smith', action: 'Made a sale', time: '4 hours ago' },
    { user: 'Mike Johnson', action: 'Updated product description', time: '6 hours ago' },
    { user: 'Sarah Williams', action: 'Responded to a customer inquiry', time: '8 hours ago' },
    { user: 'Chris Brown', action: 'Added a new product category', time: '10 hours ago' },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <p className="text-muted-foreground text-sm">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
