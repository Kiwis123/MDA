package bupt.edu.cn.web.repository;

import bupt.edu.cn.web.pojo.DataView;
import bupt.edu.cn.web.pojo.Diagram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DataViewRepository extends JpaRepository<DataView, Integer>, JpaSpecificationExecutor<DataView> {
    @Transactional
    @Query(value = "select * from data_view where project_id=?1", nativeQuery = true)
    List<DataView> findByProjectId(String projectId);

}