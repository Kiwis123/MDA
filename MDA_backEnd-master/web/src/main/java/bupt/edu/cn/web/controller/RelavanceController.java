package bupt.edu.cn.web.controller;

import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.Relavance;
import bupt.edu.cn.web.repository.RelavanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * @description:
 * @author: tc
 * @create: 2020/04/15 03:51
 */
@RestController
public class RelavanceController {
    @Autowired
    RelavanceRepository relavanceRepository;

    /**
     * 查询relavances
     */
    @RequestMapping(value = "/getRelavances", method = RequestMethod.GET)
    public ReturnModel getRelavances(String projectId){
        System.out.println("----------------getRelavances--------------");
        System.out.println("projectId:" + projectId);
        ReturnModel result = new ReturnModel();

        List<Relavance> relavanceList = relavanceRepository.findByProjectId(projectId);
        System.out.println(relavanceList);

        result.setDatum(relavanceList);
        return result;
    }


    /**
     * 新增（存储）datasource接口
     */
    @RequestMapping(value = "/saveRelavances", method = RequestMethod.POST)
    public ReturnModel saveRelavances(String source, String targets, Integer projectId){
        System.out.println("----------------saveRelavances--------------");
        System.out.println("projectId:" + projectId);
        System.out.println("source:" + source);
        System.out.println("targets:" + targets);
        ReturnModel result = new ReturnModel();

        String[] targetList = targets.split(",");
        // 根据projectId和source查询现存的target列表
        List<Relavance> relavanceList = relavanceRepository.findByProjectIdAndSource(projectId, source);
        List<String> existTargets = new ArrayList<>();
        for (int i = 0; i < relavanceList.size(); i++) {
            existTargets.add(relavanceList.get(i).getTarget());
        }
        // 如果有新的source --> target对，存储之
        for (int i = 0; i < targetList.length; i++) {
            String target = targetList[i];
            if (!existTargets.contains(target)) {
                Relavance relavance = new Relavance();
                relavance.setProjectId(projectId);
                relavance.setWorkId(1);
                relavance.setSource(source);
                relavance.setTarget(target);
                try {
                    relavanceRepository.saveAndFlush(relavance);
                    result.setResult(true);
                }catch (Exception e) {
                    result.setResult(false);
                    System.out.println(e);
                    result.setReason(e.toString());
                }
            }
        }

        return result;
    }
}
