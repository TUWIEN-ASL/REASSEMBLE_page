import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis,
  ZAxis, 
  CartesianGrid, 
  Legend,
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import './ScatterPlot.css';

type SimplifiedAction = 'Pick' | 'Insert' | 'Place' | 'Remove';

interface DataPoint {
  x: number;
  y: number;
  action: string;
  simplifiedAction: SimplifiedAction;
}

interface CSVRow {
  action: string;
  simp: SimplifiedAction;
  x: unknown;
  y: unknown;
}

interface PlotRanges {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface ScatterPlotVisualizationProps {
  markerSize?: number;
}

const COLOR_MAP: { [key in SimplifiedAction]: string } = {
  'Insert': 'var(--color-insert)',
  'Pick': 'var(--color-pick)', 
  'Place': 'var(--color-place)',
  'Remove': 'var(--color-remove)'
};

function getBaseUrl(): string {
    return import.meta.env.PROD ? '/REASSEMBLE_page' : '';
}

// Custom tooltip content component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-medium text-sm">{`Action: ${data.action}`}</p>
        <p className="text-sm">{`X: ${data.x.toFixed(3)} m`}</p>
        <p className="text-sm">{`Y: ${data.y.toFixed(3)} m`}</p>
      </div>
    );
  }
  return null;
};

const ScatterPlotVisualization: React.FC<ScatterPlotVisualizationProps> = ({ 
  markerSize: propMarkerSize 
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [plotRanges, setPlotRanges] = useState<PlotRanges>({
    xMin: 0,
    xMax: 1,
    yMin: 0,
    yMax: 1
  });
  const [markerSize, setMarkerSize] = useState<number>(4);
  const [activeFilters, setActiveFilters] = useState<SimplifiedAction[]>([
    'Pick', 'Insert', 'Place', 'Remove'
  ]);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const xMin = parseFloat(styles.getPropertyValue('--plot-x-min'));
    const xMax = parseFloat(styles.getPropertyValue('--plot-x-max'));
    const yMin = parseFloat(styles.getPropertyValue('--plot-y-min'));
    const yMax = parseFloat(styles.getPropertyValue('--plot-y-max'));
    
    const cssMarkerSize = parseFloat(styles.getPropertyValue('--plot-marker-size').trim());
    const finalMarkerSize = propMarkerSize ?? (!isNaN(cssMarkerSize) ? cssMarkerSize : 4);
    
    setPlotRanges({ xMin, xMax, yMin, yMax });
    setMarkerSize(finalMarkerSize);

    const fetchData = async () => {
      try {
        const baseUrl = getBaseUrl();
        console.log('Attempting to fetch CSV data...');
        const response = await fetch(`${baseUrl}/plots/positions.csv`);
        const fileContent = await response.text();
        
        const results = Papa.parse<CSVRow>(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        const validSimplifiedActions: SimplifiedAction[] = ['Pick', 'Insert', 'Place', 'Remove'];

        console.log('CSV parsed:', results);
        const parsedData = results.data
          .map(row => {
            const simplifiedAction = validSimplifiedActions.includes(row.simp as SimplifiedAction) 
              ? row.simp as SimplifiedAction 
              : 'Insert';

            return {
              x: typeof row.x === 'number' ? row.x : parseFloat(String(row.x)),
              y: typeof row.y === 'number' ? row.y : parseFloat(String(row.y)),
              action: row.action || 'Unknown Action',
              simplifiedAction: simplifiedAction
            };
          })
          .filter(point => !isNaN(point.x) && !isNaN(point.y));

        setData(parsedData);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    fetchData();
  }, [propMarkerSize]);

  const toggleFilter = (action: SimplifiedAction) => {
    setActiveFilters(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const filteredData = data.filter(point => 
    activeFilters.includes(point.simplifiedAction)
  );

  return (
    <div className="w-full">
      <div className="filter-container">
        {(['Pick', 'Insert', 'Place', 'Remove'] as SimplifiedAction[]).map(action => (
          <div key={action} className="filter-item">
            <input
              type="checkbox"
              id={`filter-${action}`}
              checked={activeFilters.includes(action)}
              onChange={() => toggleFilter(action)}
              className="filter-checkbox"
            />
            <label 
              htmlFor={`filter-${action}`}
              className={`cursor-pointer action-${action.toLowerCase()}`}
            >
              {action}
            </label>
          </div>
        ))}
      </div>

      <div className="scatter-plot-container">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 40,
              bottom: 20,
              left: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="X [m]" 
              unit="m"
              domain={[plotRanges.xMin, plotRanges.xMax]}
              tickCount={7}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Y [m]" 
              unit="m"
              domain={[plotRanges.yMin, plotRanges.yMax]}
              tickCount={8}
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ZAxis range={[markerSize, markerSize+1]} />
            
            {(['Pick', 'Insert', 'Place', 'Remove'] as SimplifiedAction[]).map(action => {
              const actionData = filteredData.filter(point => point.simplifiedAction === action);
              return (
                <Scatter
                  key={action}
                  name={action}
                  data={actionData}
                  fill={COLOR_MAP[action]}
                  shape="circle"
                />
              );
            })}
            
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlotVisualization;