package com.bucketlist.destinations.repository;

import java.util.List;
import com.bucketlist.destinations.model.BucketList;
import com.bucketlist.destinations.model.Destination;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BucketListRepository extends JpaRepository<BucketList, Long> {

     List<BucketList> findBucketListByBucketListPK_UserId(Long userId, Pageable pageable);
}
