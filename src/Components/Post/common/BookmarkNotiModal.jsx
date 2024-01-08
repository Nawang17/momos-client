import { Button, Flex, Modal, Text } from '@mantine/core'
import { BookmarkSimple } from '@phosphor-icons/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const BookmarkNotiModal = ({bookmarkModalOpen,setbookmarkModalOpen}) => {
    const navigate = useNavigate();

  return (
    <Modal
 
       zIndex={1000}
       size="xs"
       
       withCloseButton={false}
       opened={bookmarkModalOpen}
       onClose={() => setbookmarkModalOpen(false)}
      
      padding={0}
      overlayOpacity={0}
    >
      <Flex
      px={15}
      py={15}


  style={{
    borderRadius:'10px',
    backgroundColor:'#002b51',
    border:'1px solid #1DA1F2',
  }}
      direction={'column'} 
      ><Flex pb={15} gap={10} align={'center'}
      >
            <BookmarkSimple
            
            color="yellow"
                    weight={'fill'}
                    size={20}
                  />
      <Text
      color='white'
      size={15}>Post added to Bookmarks </Text>

      </Flex>
           
            <Button
  onClick={()=>{
    navigate('/bookmarks')
  }}

            size={'xs'}
            radius={'lg'}
            fullwidth>
        View all Bookmarks
      </Button>
      </Flex>
      
    
    </Modal>
  )
}

export default BookmarkNotiModal