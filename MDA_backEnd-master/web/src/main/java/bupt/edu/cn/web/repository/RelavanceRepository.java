package bupt.edu.cn.web.repository;

import bupt.edu.cn.web.pojo.DataView;
import bupt.edu.cn.web.pojo.Relavance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RelavanceRepository extends JpaRepository<Relavance, Integer>, JpaSpecificationExecutor<Relavance> {
    @Transactional
    @Query(value = "select * from relavance where project_id=?1", nativeQuery = true)
    List<Relavance> findByProjectId(String projectId);


    @Transactional
    @Query(value = "select * from relavance where project_id=?1 and source=?2", nativeQuery = true)
    List<Relavance> findByProjectIdAndSource(Integer projectId, String source);
}