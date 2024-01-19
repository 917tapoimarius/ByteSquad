package com.bucketlist.destinations.repository;

import java.util.List;
import java.util.Optional;

import com.bucketlist.destinations.model.BucketList;
import com.bucketlist.destinations.model.Destination;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface BucketListRepository extends JpaRepository<BucketList, Long> {

     BucketList findBucketListByBucketListPK(BucketList.BucketListPK bucketListPK);

     BucketList findBucketListByBucketListPK_UserIdAndBucketListPK_DestinationId(Long userId, Long DestinationId);

     boolean existsByBucketListPK_UserIdAndBucketListPK_DestinationId(Long userId, Long destinationId);

     void deleteByBucketListPK_UserIdAndBucketListPK_DestinationId(Long userId, Long destinationId);

     Integer countBucketListByBucketListPK_DestinationId(Long destinationId);

     List<BucketList> findBucketListByBucketListPK_UserId(Long userId, Pageable pageable);

     @Modifying
     @Query(value = "UPDATE \"BucketList\" SET destination_id = :destinationId, description = :description WHERE destination_in_list_id = :destinationInListId", nativeQuery = true)
     void update(Long destinationId, String description, Long destinationInListId);
}
