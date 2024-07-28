import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function addVideoDetialsToDB(title , desccription , author , url ){
    
    const videoData = await prisma.videoData.create({
        data:{
            title:title,
            description: desccription,
            author:author,
            url:url
        }
    })
    console.log(videoData);
    return ;
}

export async function deleteVideoFromDB( id ){
    
    try {
        const videoId = Number(id); // Convert id to a number
        if (isNaN(videoId)) {
            throw new Error('The id parameter must be a valid number');
        }

        const deletevideo = await prisma.videoData.delete({
        where:{
            id: videoId,
        },
        })
    console.log('Deleted Video:', deletevideo);
    } catch (error) {
        console.error('Error deleting Video:' , error);
    }
    
}

