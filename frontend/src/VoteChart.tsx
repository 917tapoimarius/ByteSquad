import { Chart } from 'react-google-charts';
import React, { useEffect, useState } from 'react';

interface Vote {
    voteId: number;
    destinationId: string;
    month: number;
    number: number;
    keyForRefresh: number;
}

interface VoteProps {
    destinationId: number;
}

const VoteChart: React.FC<VoteProps> = ({ destinationId, keyForRefresh }) => {
    const [votes, setVotes] = useState<Vote[]>([]);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/destination/votes/${destinationId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const votesData: Vote[] = await response.json();
                setVotes(votesData);
            } catch (error) {
                console.error('Error fetching votes:', error);
            }
        };

        fetchVotes();
    }, [destinationId, keyForRefresh]);

    const getMonthName = (monthNumber: number) => {
        const date = new Date(2000, monthNumber - 1, 1); // Year 2000 is arbitrary, day set to 1 to avoid issues
        return date.toLocaleString('en-US', { month: 'long' });
    };

    const getChartData = () => {
        const histogramData: (string | number)[][] = [['Month', 'Number of Votes']];
        for (let i = 1; i <= 12; i++) {
            const votesForMonth = votes.filter((vote) => vote.month === i);
            const numberOfVotes = votesForMonth.length > 0 ? votesForMonth[0].number : 0;
            histogramData.push([getMonthName(i), numberOfVotes]);
        }
        return histogramData;
    };

    return (
        <div className="VoteChart">
            <Chart
                //width={'1110px'}
                height={'500px'}
                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={getChartData()}
                options={{
                    title: 'Votes by Month',
                    legend: { position: 'none' },
                    vAxis: { title: 'Number of Votes' },
                    colors: ['#FFA500'], // Orange color
                }}
            />
        </div>
    );
};

export default VoteChart;



