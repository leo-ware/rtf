export default () => null


// "use client";

// import { useState, useEffect } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";
// import { ReorderableList, ReorderableListItem, ReorderableListDragHandle } from "@/components/ReorderableList";
// import { Badge } from "@/components/ui/badge";
// import { User, Star, Heart, Users, MessageCircle, Trophy } from "lucide-react";

// type PersonType = "director" | "staff" | "equine" | "storyteller" | "ambassador" | "inMemoriam";

// interface PersonWithImage {
//     _id: Id<"people">;
//     _creationTime: number;
//     name: string;
//     title: string;
//     bio: string;
//     imageId?: Id<"images">;
//     isDirector: boolean;
//     isStaff?: boolean;
//     isEquine?: boolean;
//     isStoryTeller?: boolean;
//     isAmbassador?: boolean;
//     inMemoriam: boolean;
//     directorOrder?: number;
//     staffOrder?: number;
//     equineOrder?: number;
//     storytellerOrder?: number;
//     ambassadorOrder?: number;
//     inMemoriamOrder?: number;
//     createdBy: Id<"users">;
//     createdAt: number;
//     updatedAt: number;
//     image?: {
//         imageUrl: string | null;
//     };
// }

// const PersonCard = ({ person }: { person: PersonWithImage }) => {
//     return (
//         <Card className="hover:shadow-md transition-shadow">
//             <CardContent className="p-4">
//                 <div className="flex items-start gap-3">
//                     <ReorderableListDragHandle />
//                     {person.image?.imageUrl ? (
//                         <img
//                             src={person.image.imageUrl}
//                             alt={person.name}
//                             className="w-16 h-16 rounded-lg object-cover"
//                         />
//                     ) : (
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
//                             <User className="h-8 w-8 text-gray-400" />
//                         </div>
//                     )}
//                     <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-lg truncate">{person.name}</h3>
//                         <p className="text-sm text-gray-600 truncate">{person.title}</p>
//                         <div className="flex gap-1 mt-2 flex-wrap">
//                             {person.isDirector && (
//                                 <Badge variant="secondary" className="text-xs">
//                                     <Star className="h-3 w-3 mr-1" />
//                                     Director
//                                 </Badge>
//                             )}
//                             {person.isStaff && (
//                                 <Badge variant="secondary" className="text-xs">
//                                     <Users className="h-3 w-3 mr-1" />
//                                     Staff
//                                 </Badge>
//                             )}
//                             {person.isEquine && (
//                                 <Badge variant="secondary" className="text-xs">
//                                     <Heart className="h-3 w-3 mr-1" />
//                                     Equine
//                                 </Badge>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// const PersonList = ({ personType }: { personType: PersonType }) => {
//     const people = useQuery(api.people.listPeople, { personType, limit: 100 });
//     const updatePersonOrder = useMutation(api.people.updatePersonOrder);

//     const [localPeople, setLocalPeople] = useState<PersonWithImage[]>([]);

//     useEffect(() => {
//         if (people) {
//             setLocalPeople(people as PersonWithImage[]);
//         }
//     }, [people]);

//     const handleReorder = async (newOrder: string[]) => {
//         const reorderedPeople = newOrder.map((id, index) => {
//             const person = localPeople.find(p => p._id === id);
//             return { ...person!, newOrder: index };
//         });

//         setLocalPeople(reorderedPeople.map(p => {
//             const updateField = `${personType}Order` as keyof PersonWithImage;
//             return { ...p, [updateField]: p.newOrder };
//         }));

//         try {
//             await Promise.all(
//                 reorderedPeople.map((person) =>
//                     updatePersonOrder({
//                         id: person._id,
//                         personType: personType,
//                         order: person.newOrder,
//                     })
//                 )
//             );
//         } catch (error) {
//             console.error("Error updating order:", error);
//             if (people) {
//                 setLocalPeople(people as PersonWithImage[]);
//             }
//         }
//     };

//     if (people === undefined) {
//         return (
//             <div className="space-y-4">
//                 {[...Array(3)].map((_, i) => (
//                     <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
//                 ))}
//             </div>
//         );
//     }

//     if (localPeople.length === 0) {
//         return (
//             <div className="text-center py-12">
//                 <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No people in this category</h3>
//                 <p className="text-gray-600">Add people to this category from the People tab</p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <p className="text-sm text-gray-600 mb-4">
//                 Drag and drop to reorder. Changes are saved automatically.
//             </p>
//             <ReorderableList onReorder={handleReorder}>
//                 {localPeople.map((person) => (
//                     <ReorderableListItem key={person._id} id={person._id} className="mb-2">
//                         <PersonCard person={person} />
//                     </ReorderableListItem>
//                 ))}
//             </ReorderableList>
//         </div>
//     );
// };

// const ListsTab = () => {
//     return (
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-2xl font-bold mb-2">Manage Display Order</h2>
//                 <p className="text-gray-600">
//                     Control the order in which people appear on your website by dragging and dropping them below.
//                 </p>
//             </div>

//             <Tabs defaultValue="directors" className="w-full">
//                 <TabsList className="grid w-full grid-cols-6">
//                     <TabsTrigger value="directors">Directors</TabsTrigger>
//                     <TabsTrigger value="staff">Staff</TabsTrigger>
//                     <TabsTrigger value="equine">Equine</TabsTrigger>
//                     <TabsTrigger value="storytellers">Storytellers</TabsTrigger>
//                     <TabsTrigger value="ambassadors">Ambassadors</TabsTrigger>
//                     <TabsTrigger value="in-memoriam">In Memoriam</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="directors" className="mt-6">
//                     <PersonList personType="director" />
//                 </TabsContent>

//                 <TabsContent value="staff" className="mt-6">
//                     <PersonList personType="staff" />
//                 </TabsContent>

//                 <TabsContent value="equine" className="mt-6">
//                     <PersonList personType="equine" />
//                 </TabsContent>

//                 <TabsContent value="storytellers" className="mt-6">
//                     <PersonList personType="storyteller" />
//                 </TabsContent>

//                 <TabsContent value="ambassadors" className="mt-6">
//                     <PersonList personType="ambassador" />
//                 </TabsContent>

//                 <TabsContent value="in-memoriam" className="mt-6">
//                     <PersonList personType="inMemoriam" />
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// };

// export default ListsTab;
