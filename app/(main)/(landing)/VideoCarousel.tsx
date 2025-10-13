"use client"

import Vimeo from "@/components/Vimeo"
import { FaCaretLeft, FaCaretRight, FaPlay } from "react-icons/fa"
import { useEffect, useState } from "react";

const getThumbnail = async (videoId: string) => {
    const response = await fetch(
        `https://vimeo.com/api/v2/video/${videoId}.json`
    );
    const data = await response.json();
    const thumbnail = data[0].thumbnail_large as string;
    return { thumbnail }
}

const carouselItems = [
    {
        title: 'Robert Redford stands with America\'s wild horses',
        videoId: '423814174',
    },
    {
        title: "\'Spirit: Untamed\' director visits RTF's sanctuary",
        videoId: '567146784',
    },
    {
        title: 'Stand with America\'s wild horses and burros',
        videoId: '263067600',
    },
    {
        title: 'Join Wendie Malick in the fight to protect America\'s wild horses',
        videoId: '160682894',
    }
]

const addThumbnails = async (items: typeof carouselItems) => {
    const itemsWithThumbnails = await Promise.all(items.map(async (item) => {
        const thumbnail = await getThumbnail(item.videoId);
        return { ...item, thumbnail: thumbnail.thumbnail };
    }));
    return itemsWithThumbnails;
}

const VideoCarousel = () => {
    const [items, setItems] = useState<Awaited<ReturnType<typeof addThumbnails>>>([]);
    const [clicked, setClicked] = useState<boolean[]>(items.map(() => false));
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        addThumbnails(carouselItems).then(setItems);
    }, []);

    return (
        <div className="z-0 relative w-full h-fit overflow-x-hidden">
            <div className="z-10 absolute w-fit h-fit bottom-12 right-2/12 translate-x-1/2 flex gap-4">
                <div>
                    <FaCaretLeft
                        className="w-4 h-4"
                        color="white"
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        />
                </div>
                {items.map((_, i) => (
                    <div
                        key={i}
                        className={"w-4 h-4 rounded-full cursor-pointer border-1 border-white " +
                            (currentIndex === i ? "bg-white" : "bg-tranparent")
                        }
                        onClick={() => setCurrentIndex(i)}
                    />
                ))}
                <div>
                    <FaCaretRight
                        className="w-4 h-4"
                        color="white"
                        onClick={() => setCurrentIndex(Math.min(items.length - 1, currentIndex + 1))}
                        />
                </div>
            </div>

            <div
                className="z-0 relative flex h-fit w-[400vw] transition-all duration-500"
                style={{
                    left: `-${currentIndex * 100}vw`
                }}
            >
                {items.map((item, index) => {
                    const isClicked = clicked[index];
                    const setItemClicked = (val: boolean) => {
                        setClicked(prev => {
                            const prevCopy = [...prev];
                            prevCopy[index] = val;
                            return prevCopy;
                        })
                    }
                    return (
                        <div className="relative z-0 w-full h-fit flex items-stretch" key={item.videoId}>
                            <img
                                src={item.thumbnail}
                                alt="Thumbnail"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />

                            <div className={"relative w-2/3 h-fit " + (isClicked ? "opacity-100 z-10" : "opacity-0")}>
                                <Vimeo videoId={item.videoId} />
                            </div>

                            <div className="absolute flex justify-end w-full h-full">
                                <div className={"w-2/3 h-full flex items-center justify-center " +
                                    (isClicked ? "hidden" : "block")}>
                                    <div
                                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
                                        onClick={() => setItemClicked(true)}
                                    >
                                        <FaPlay className="text-burnt-orange ml-1" />
                                    </div>
                                </div>

                                <div
                                    className="w-1/3 h-full bg-black/50 p-10 pl-12"
                                    onClick={() => setItemClicked(false)}
                                >
                                    <div className="w-full h-full flex items-center justify-end">
                                        <div className="text-white text-right font-serif text-4xl">
                                            {item.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default VideoCarousel