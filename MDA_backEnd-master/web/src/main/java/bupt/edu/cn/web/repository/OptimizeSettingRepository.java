package bupt.edu.cn.web.repository;

import bupt.edu.cn.web.pojo.OptimizeSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface OptimizeSettingRepository extends JpaRepository<OptimizeSetting, Integer>, JpaSpecificationExecutor<OptimizeSetting> {

    @Transactional
    @Query(value = "select * from optimize_setting where cube_name=?1 and project_id=1", nativeQuery = true)
    public OptimizeSetting findByCubeName(String cubeName);

}