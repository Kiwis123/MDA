package bupt.edu.cn.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import bupt.edu.cn.web.pojo.Diagram;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DiagramRepository extends JpaRepository<Diagram, Integer>, JpaSpecificationExecutor<Diagram> {
//    @Override
//    List<Diagram> findAllById(Iterable<Long> iterable);
    Diagram findByIdEquals(Long id);

    @Transactional
    @Query(value = "select * from diagram where user_id=?1", nativeQuery = true)
    List<Diagram> findByUserId(String userId);
    List<Diagram> findByUserIdAndSaved(String userId,String saved);
    Diagram findByIdAndUserId(Long id,String userId);
}