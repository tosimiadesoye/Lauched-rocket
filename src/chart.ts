import "anychart";

export const chart = (
  data: anychart.data.Set | anychart.data.DataSettings | undefined
) => {
  return anychart.onDocumentReady(() => {
    let chart = anychart.column();
    chart.data(data);
    chart.title("Launches per country");
    chart.container("container");
    chart.draw();
  });
};
