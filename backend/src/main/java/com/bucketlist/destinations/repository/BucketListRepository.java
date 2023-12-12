package com.bucketlist.destinations.repository;

import java.util.List;
import java.util.Optional;

import com.bucketlist.destinations.model.BucketList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BucketListRepository extends JpaRepository<BucketList, Long> {

     List<BucketList> findBucketListByBucketListPK_UserId(Long userId);

     boolean existsByBucketListPK_UserIdAndBucketListPK_DestinationId(Long userId, Long destinationId);

}
