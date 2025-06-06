export default async function getIcon(imageName, imageElement) {
  try {
    import(`./images/${imageName}.svg`).then((module) => {
      imageElement.src = module.default;
    });
  } catch (err) {
    console.log(err);
    import(`./images/cloudy.svg`).then((module) => {
      imageElement.src = module.default;
    });
  }
}
