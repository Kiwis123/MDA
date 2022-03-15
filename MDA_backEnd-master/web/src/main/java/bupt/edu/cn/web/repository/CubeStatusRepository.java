package bupt.edu.cn.web.repository;

import bupt.edu.cn.web.pojo.CubeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CubeStatusRepository extends JpaRepository<CubeStatus, Integer>, JpaSpecificationExecutor<CubeStatus> {

    @Transactional
    @Query(value = "select avg(cube_num) from cube_status where project_id=?1 and time between date_add(now(), interval -31 day ) and date_add(now(), interval -1 day )", nativeQuery = true)
    public Double countCubeNumLastMonth(Integer projectId);

    @Transactional
    @Query(value = "select avg(cube_size) from cube_status where project_id=?1 and time between date_add(now(), interval -31 day ) and date_add(now(), interval -1 day )", nativeQuery = true)
    public Double countCubeSizeLastMonth(Integer projectId);

    @Transactional
    @Query(value = "select avg(expansion_rate) from cube_status where project_id=?1 and time between date_add(now(), interval -31 day ) and date_add(now(), interval -1 day )", nativeQuery = true)
    public Double countExpansionRateLastMonth(Integer projectId);

    @Transactional
    @Query(value = "select avg(expansion_rate),month(time) from cube_status group by month(time) limit 6", nativeQuery = true)
    public List countExpansionRateMultipleMonth(Integer projectId);

}