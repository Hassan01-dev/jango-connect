import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FriendRequest from "./FriendRequest";
import NewFriend from "./NewFriend";
import ExistingFriends from "./ExistingFriends";

const FriendSection = () => {
  return ( 
    <div>
      <h1>Friend</h1>
      <Tabs defaultValue="requests" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="requests">Friend Request</TabsTrigger>
          <TabsTrigger value="newFriend">Add Friend</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="requests"><FriendRequest /></TabsContent>
        <TabsContent value="newFriend"><NewFriend /></TabsContent>
        <TabsContent value="friends"><ExistingFriends /></TabsContent>
      </Tabs>
    </div>
  );
}

export default FriendSection
