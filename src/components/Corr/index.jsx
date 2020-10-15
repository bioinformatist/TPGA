import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
// import { Spin } from 'antd';

// https://cloud.tencent.com/developer/article/1397552
export default function Corr(props) {
  const { gene, group } = props;
  const chartRef = useRef(null);
  const gse = group.split('_')[1];
  // const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  let chartInstance = null;

  function renderChart() {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current);
    if (renderedInstance) {
      chartInstance = renderedInstance;
    } else {
      chartInstance = echarts.init(chartRef.current);
    }
    chartInstance.setOption({
      toolbox: {
        show: true,
        feature: {
          dataView: {
            show: true,
            readOnly: true,
          },
          restore: {
            show: true,
          },
          saveAsImage: {
            show: true,
          },
        },
      },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [{
        name: 'Correlation',
        type: 'graph',
        layout: 'force',

        force: {
          edgeLength: 50,
          repulsion: 50,
          gravity: 0.2,
        },
        data: data.nodes,
        edges: data.links,
        categories: data.categories,
        focusNodeAdjacency: true,
        roam: true,
        label: {
          normal: {
            position: 'right',
            formatter: '{b}',
          },
        },
        lineStyle: {
          normal: {
            // color: 'target',
            curveness: 0,
          },
        },
      }],
    });
  }

  // https://stackoverflow.com/a/40981298
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#Chaining
  useEffect(() => {
    fetch(`/api/plots/corr/${gene}-${gse}`)
      .then((res) => {
        let fuckingPromise;
        if (!res.ok) {
          fuckingPromise = fetch(`/api/plots/corr/${gene}-${group}`);
        } else {
          fuckingPromise = res;
        }
        return fuckingPromise;
      })
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result);
        },
      );

    renderChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => () => {
    if (chartInstance) {
      chartInstance.dispose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const chart = isLoaded ? (
  //   <div ref={chartRef} style={{ width: '100%', height: '500%' }} />
  // ) : (
  //   <Spin size="large" tip="Loading..." />
  // );

  return (
    // <>
    //   { chart }
    // </>
    <div ref={chartRef} style={{ width: '100%', height: '500%' }} />
  );
}

Corr.propTypes = {
  gene: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
};
